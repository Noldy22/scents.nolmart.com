// js/scent-quiz.js
// Interactive 5-Question Scent Matcher for NolMart Scents

import { PRODUCTS, getProductById } from './products-data.js';
import { addItemToCart } from './cart.js';
import { openCartDrawer, directWhatsAppOrder, showToast } from './cart-drawer.js';

export function initScentQuiz() {
    const quizForm = document.getElementById('scentQuizForm');
    const quizResult = document.getElementById('scentQuizResult');
    if (!quizForm || !quizResult) return;

    let currentStep = 1;
    const totalSteps = 5;

    const answers = {
        gender: "women",
        vibe: "sweet",
        occasion: "daily",
        intensity: "balanced",
        size: "30ml"
    };

    const stepEls = quizForm.querySelectorAll('.quiz-step');
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    const progressFill = document.getElementById('quizProgressFill');
    const stepCounter = document.getElementById('quizStepCounter');

    function updateStep() {
        stepEls.forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            el.classList.toggle('active', stepNum === currentStep);
        });

        if (progressFill) {
            progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
        }

        if (stepCounter) {
            stepCounter.textContent = `Question ${currentStep} of ${totalSteps}`;
        }

        if (prevBtn) {
            prevBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
        }

        if (nextBtn) {
            nextBtn.textContent = currentStep === totalSteps ? 'Reveal My Perfect Match 🔮' : 'Continue →';
        }
    }

    // Option selection with auto-advance on selection
    quizForm.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.group;
            const value = btn.dataset.value;

            quizForm.querySelectorAll(`.quiz-option-btn[data-group="${group}"]`).forEach(b => {
                b.classList.remove('selected');
            });

            btn.classList.add('selected');
            answers[group] = value;

            // Smooth brief auto-advance after selecting an option
            if (currentStep < totalSteps) {
                setTimeout(() => {
                    currentStep++;
                    updateStep();
                }, 220);
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStep();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStep();
            } else {
                calculateAndRenderResult(answers);
            }
        });
    }

    // Retake quiz button
    const retakeBtn = document.getElementById('retakeQuizBtn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            quizResult.style.display = 'none';
            quizForm.style.display = 'block';
            currentStep = 1;
            updateStep();
        });
    }

    updateStep();
}

function calculateAndRenderResult(answers) {
    const quizForm = document.getElementById('scentQuizForm');
    const quizResult = document.getElementById('scentQuizResult');
    const matchContainer = document.getElementById('quizMatchContainer');

    let matchedId = "crown-noir";
    let runnerUpId = "azure-vip";
    let matchReason = "";

    // If user explicitly picked Discovery Bundle
    if (answers.size === "bundle") {
        matchedId = "bundle-try-and-buy";
        runnerUpId = answers.gender === "men" ? "crown-noir" : "cashmere-bloom";
        matchReason = "The Discovery Set lets you choose any 3 fragrances in convenient 10ml pocket sprayers with instant savings!";
    } else if (answers.gender === "men") {
        if (answers.vibe === "woody" || answers.intensity === "bold" || answers.occasion === "night") {
            matchedId = "crown-noir"; // Men's Bold Flagship
            runnerUpId = "obsidian-reef";
            matchReason = "Matched for commanding presence, rich smoky woods, and all-day confidence.";
        } else if (answers.vibe === "fresh" || answers.occasion === "casual") {
            matchedId = "212-vip-men";
            runnerUpId = "azure-vip";
            matchReason = "Matched for crisp mint, fresh citrus, and modern clean nightlife energy.";
        } else {
            matchedId = "azure-vip"; // Men's Calm Flagship
            runnerUpId = "crown-noir";
            matchReason = "Matched for smooth vanilla, fresh bergamot, and refined office elegance.";
        }
    } else if (answers.gender === "women") {
        if (answers.intensity === "bold" || answers.occasion === "night") {
            matchedId = "onyx-bloom"; // Women's Bold Flagship
            runnerUpId = "cashmere-bloom";
            matchReason = "Matched for deep, seductive woody notes balanced with romantic floral petals.";
        } else if (answers.vibe === "sweet" || answers.vibe === "gourmand") {
            matchedId = "marshmallow";
            runnerUpId = "cashmere-bloom";
            matchReason = "Matched for cozy, irresistible sweet spun sugar, vanilla, and comfort.";
        } else if (answers.vibe === "floral" || answers.occasion === "work") {
            matchedId = "burberry-weekend";
            runnerUpId = "cashmere-bloom";
            matchReason = "Matched for graceful powdery florals, mandarin freshness, and poise.";
        } else {
            matchedId = "cashmere-bloom"; // Women's Elegant Flagship
            runnerUpId = "onyx-bloom";
            matchReason = "Matched for approachable luxury, powdery elegance, and sweet warmth that draws compliments.";
        }
    } else { // Unisex / Shared
        if (answers.vibe === "woody" || answers.intensity === "bold") {
            matchedId = "obsidian-reef";
            runnerUpId = "midnight-velvet";
            matchReason = "Matched for deep mysterious woods elevated by crisp ocean breezes.";
        } else if (answers.vibe === "sweet") {
            matchedId = "coastal-dream";
            runnerUpId = "velvet-noir";
            matchReason = "Matched for warm island coconut layered over rich vanilla comfort.";
        } else {
            matchedId = "ocean-breeze";
            runnerUpId = "electric-rush";
            matchReason = "Matched for invigorating marine sea spray and clean energizing citrus.";
        }
    }

    const matchedProduct = getProductById(matchedId) || PRODUCTS[0];
    const runnerUpProduct = getProductById(runnerUpId);

    // Selected size resolution
    let chosenSize = answers.size === "10ml" ? "10ml" : "30ml";
    if (!matchedProduct.prices[chosenSize]) {
        chosenSize = Object.keys(matchedProduct.prices)[0] || "30ml";
    }

    const currentPrice = matchedProduct.prices[chosenSize] || Object.values(matchedProduct.prices)[0];

    matchContainer.innerHTML = `
        <div class="match-card">
            <div class="match-badge">⭐ 99% MATCH FOR YOUR PROFILE</div>
            <div class="match-grid">
                <div class="match-image-box">
                    <img src="${matchedProduct.imageUrl}" alt="${matchedProduct.name}">
                </div>
                <div class="match-info">
                    <div class="match-category-tag">${matchedProduct.badge}</div>
                    <h3 class="match-title">${matchedProduct.name}</h3>
                    <p class="match-tagline">${matchedProduct.tagline}</p>
                    
                    <div style="background: rgba(33, 116, 219, 0.06); border-left: 3px solid var(--brand-blue); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.9rem; color: var(--brand-navy);">
                        💡 <strong>Why this was picked for you:</strong> ${matchReason}
                    </div>

                    <p class="match-desc">${matchedProduct.description}</p>
                    
                    ${matchedProduct.notes ? `
                    <div class="match-notes">
                        <div class="note-pill"><strong>Top:</strong> ${matchedProduct.notes.top.slice(0, 2).join(', ')}</div>
                        <div class="note-pill"><strong>Heart:</strong> ${matchedProduct.notes.heart.slice(0, 2).join(', ')}</div>
                        <div class="note-pill"><strong>Base:</strong> ${matchedProduct.notes.base.slice(0, 2).join(', ')}</div>
                    </div>` : ''}

                    <div class="match-pricing">
                        <div class="size-choice-box">
                            <label>Selected Bottle Size:</label>
                            <div class="size-buttons" id="quizSizeSelector">
                                ${Object.keys(matchedProduct.prices).map(size => `
                                    <button type="button" class="size-choice-btn ${size === chosenSize ? 'active' : ''}" data-size="${size}">
                                        ${size} • Tzs ${matchedProduct.prices[size].toLocaleString('en-US')}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="match-actions">
                            <button class="btn btn-primary" id="quizAddToCartBtn" style="flex: 1;">
                                🛒 Add to Shopping Bag
                            </button>
                            <button class="btn btn-whatsapp" id="quizWhatsAppBtn" style="flex: 1;">
                                💬 Buy on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            ${runnerUpProduct ? `
            <div style="margin-top: 30px; padding-top: 24px; border-top: 1px dashed var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <img src="${runnerUpProduct.imageUrl}" alt="${runnerUpProduct.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: var(--radius-sm); background: #fff; padding: 4px; border: 1px solid var(--border-color);">
                    <div>
                        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-weight: 700;">Alternative Recommendation</span>
                        <h4 style="margin: 0; font-size: 1.05rem; color: var(--brand-navy-dark);">${runnerUpProduct.name} — <span style="font-size: 0.88rem; font-weight: normal; color: var(--text-secondary);">${runnerUpProduct.tagline}</span></h4>
                    </div>
                </div>
                <a href="product.html?id=${runnerUpProduct.id}" class="btn btn-outline-primary" style="padding: 8px 18px; font-size: 0.85rem;">
                    View Details →
                </a>
            </div>
            ` : ''}
        </div>
    `;

    // Size selection handler
    let activeSize = chosenSize;
    matchContainer.querySelectorAll('.size-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            matchContainer.querySelectorAll('.size-choice-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSize = btn.dataset.size;
        });
    });

    // Add to cart
    const addBtn = document.getElementById('quizAddToCartBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addItemToCart(matchedProduct, activeSize, 1);
            showToast(`Added ${matchedProduct.name} (${activeSize}) to your bag!`);
        });
    }

    // Direct WhatsApp
    const waBtn = document.getElementById('quizWhatsAppBtn');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            directWhatsAppOrder(matchedProduct, activeSize, 1);
        });
    }

    // Show result
    quizForm.style.display = 'none';
    quizResult.style.display = 'block';

    // Smooth scroll to results
    quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
