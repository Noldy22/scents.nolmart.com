"""Make the web copy of the NolMart brand bottle (models/nolmart-bottle.glb).

Input:  the GLB exported from Blender by D:\\projects\\3D Models\\brand_bottle\\export_perfume.py
Output: a lighter GLB for the website.

What changes (geometry and object names stay exactly as modelled):
  * the packed label PNG is removed - the site paints a label for every scent at runtime
  * positions -> int16 (10 micron steps), normals -> int8, label UVs -> uint16 (KHR_mesh_quantization,
    read natively by three.js GLTFLoader), so the file is roughly 4x smaller
  * the dip tube's unused UVs are dropped

Usage: python -I tools/optimize_bottle_glb.py <in.glb> <out.glb> [--shorten Y0 Y1 D]

--shorten makes a shorter bottle from the same model: the straight section between heights Y0 and Y1
(metres, bottle standing on y = 0) is squeezed by D metres and everything above it moves down by D.
Used to make the 6 ml vial from the 10 ml one.
"""
import json
import struct
import sys

import numpy as np

SRC, DST = sys.argv[1], sys.argv[2]
SHORTEN = None
if "--shorten" in sys.argv:
    i = sys.argv.index("--shorten")
    SHORTEN = tuple(float(v) for v in sys.argv[i + 1:i + 4])
Q = 1e-5  # metres per position step

COMP = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}

raw = open(SRC, "rb").read()
jlen = struct.unpack("<I", raw[12:16])[0]
gltf = json.loads(raw[20:20 + jlen])
bin_off = 20 + jlen + 8
blob = raw[bin_off:]


def read(acc_i):
    acc = gltf["accessors"][acc_i]
    bv = gltf["bufferViews"][acc["bufferView"]]
    dt = np.dtype(COMP[acc["componentType"]])
    n = NCOMP[acc["type"]]
    start = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    stride = bv.get("byteStride", dt.itemsize * n)
    out = np.empty((acc["count"], n), dt)
    for i in range(acc["count"]):
        out[i] = np.frombuffer(blob, dt, n, start + i * stride)
    return out


new_bin = bytearray()
views, accs = [], []


def add(arr, comp, typ, stride=None, normalized=False, target=None, minmax=False):
    """Append arr (count x n) to the new buffer, padding each element to `stride` bytes."""
    while len(new_bin) % 4:
        new_bin.append(0)
    count, n = arr.shape
    item = arr.dtype.itemsize * n
    if stride and stride != item:
        padded = np.zeros((count, stride // arr.dtype.itemsize), arr.dtype)
        padded[:, :n] = arr
        data = padded.tobytes()
    else:
        data = arr.tobytes()
    bv = {"buffer": 0, "byteOffset": len(new_bin), "byteLength": len(data)}
    if stride and stride != item:
        bv["byteStride"] = stride
    if target:
        bv["target"] = target
    new_bin.extend(data)
    views.append(bv)
    acc = {"bufferView": len(views) - 1, "componentType": comp, "count": count, "type": typ}
    if normalized:
        acc["normalized"] = True
    if minmax:
        acc["min"] = arr.min(0).tolist()
        acc["max"] = arr.max(0).tolist()
    accs.append(acc)
    return len(accs) - 1


def squeeze(pos, nrm):
    """Shorten the straight section [Y0, Y1] by D; shift everything above it down by D."""
    y0, y1, d = SHORTEN
    k = (y1 - y0 - d) / (y1 - y0)
    y = pos[:, 1]
    mid = (y > y0) & (y < y1)
    above = y >= y1
    out = pos.copy()
    out[mid, 1] = y0 + (y[mid] - y0) * k
    out[above, 1] = y[above] - d
    n = nrm.copy()
    n[mid, 1] /= k  # normals of a y-scaled surface
    return out, n


# Meshes placed by their own node translation (nozzle parts) just move with the top
moved_meshes = set()
if SHORTEN:
    for node in gltf["nodes"]:
        t = node.get("translation")
        if "mesh" in node and t and t[1] >= SHORTEN[1]:
            t[1] -= SHORTEN[2]
            moved_meshes.add(node["mesh"])

for mi, mesh in enumerate(gltf["meshes"]):
    for prim in mesh["primitives"]:
        attrs = prim["attributes"]
        new_attrs = {}

        pos = read(attrs["POSITION"]).astype(np.float64)
        nrm = read(attrs["NORMAL"]).astype(np.float64)
        if SHORTEN and mi not in moved_meshes:
            pos, nrm = squeeze(pos, nrm)
        qpos = np.round(pos / Q)
        assert np.abs(qpos).max() < 32767, "model too large for int16 quantisation"
        new_attrs["POSITION"] = add(qpos.astype(np.int16), 5122, "VEC3", stride=8, target=34962, minmax=True)

        nrm /= np.maximum(np.linalg.norm(nrm, axis=1, keepdims=True), 1e-12)
        new_attrs["NORMAL"] = add(np.round(nrm * 127).astype(np.int8), 5120, "VEC3", stride=4,
                                  normalized=True, target=34962)

        mat_name = gltf["materials"][prim["material"]]["name"] if "material" in prim else ""
        if "TEXCOORD_0" in attrs and mat_name.startswith("Label"):
            uv = np.clip(read(attrs["TEXCOORD_0"]).astype(np.float64), 0, 1)
            new_attrs["TEXCOORD_0"] = add(np.round(uv * 65535).astype(np.uint16), 5123, "VEC2",
                                          normalized=True, target=34962)

        idx = read(prim["indices"]).ravel()
        if idx.max() < 65535:
            prim["indices"] = add(idx.astype(np.uint16)[:, None], 5123, "SCALAR", target=34963)
        else:
            prim["indices"] = add(idx.astype(np.uint32)[:, None], 5125, "SCALAR", target=34963)
        prim["attributes"] = new_attrs

# Dequantise positions through the node transform (T * R * S keeps nested placement intact)
for node in gltf["nodes"]:
    if "mesh" in node:
        node["scale"] = [Q, Q, Q]
    if node.get("name", "").startswith("Label_"):
        node["name"] = "Label"

# The label is painted at runtime per scent: drop the packed artwork
for m in gltf["materials"]:
    pbr = m.get("pbrMetallicRoughness", {})
    pbr.pop("baseColorTexture", None)
for k in ("images", "textures", "samplers"):
    gltf.pop(k, None)

gltf["accessors"] = accs
gltf["bufferViews"] = views
while len(new_bin) % 4:
    new_bin.append(0)
gltf["buffers"] = [{"byteLength": len(new_bin)}]
for key in ("extensionsUsed", "extensionsRequired"):
    lst = gltf.setdefault(key, [])
    if "KHR_mesh_quantization" not in lst:
        lst.append("KHR_mesh_quantization")
gltf["asset"]["generator"] = "NolMart optimize_bottle_glb.py"

js = json.dumps(gltf, separators=(",", ":")).encode()
js += b" " * ((4 - len(js) % 4) % 4)
total = 12 + 8 + len(js) + 8 + len(new_bin)
with open(DST, "wb") as f:
    f.write(struct.pack("<III", 0x46546C67, 2, total))
    f.write(struct.pack("<II", len(js), 0x4E4F534A))
    f.write(js)
    f.write(struct.pack("<II", len(new_bin), 0x004E4942))
    f.write(new_bin)
print(f"wrote {DST}: {total / 1024:.0f} KB (from {len(raw) / 1024:.0f} KB)")
