// js/scent-quiz.js
// Interactive 30-Second Fragrance Matcher for NolMart Scents

import { PRODUCTS, getProductById } from './products-data.js';
import { addItemToCart } from './cart.js';
import { openCartDrawer, directWhatsAppOrder, showToast } from './cart-drawer.js';

export function initScentQuiz() {
    const quizForm = document.getElementById('scentQuizForm');
    const quizResult = document.getElementById('scentQuizResult');
    if (!quizForm || !quizResult) return;

    let currentStep = 1;
    const totalSteps = 3;

    const answers = {
        gender: "unisex",
        vibe: "bold",
        occasion: "night"
    };

    // Step navigation
    const stepEls = quizForm.querySelectorAll('.quiz-step');
    const prevBtn = document.getElementById('quizPrevBtn');
    const nextBtn = document.getElementById('quizNextBtn');
    const progressFill = document.getElementById('quizProgressFill');

    function updateStep() {
        stepEls.forEach(el => {
            el.classList.toggle('active', parseInt(el.dataset.step) === currentStep);
        });

        if (progressFill) {
            progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
        }

        if (prevBtn) {
            prevBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
        }

        if (nextBtn) {
            nextBtn.textContent = currentStep === totalSteps ? 'Reveal My Signature Match 🔮' : 'Continue →';
        }
    }

    // Option selection
    quizForm.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.dataset.group;
            const value = btn.dataset.value;

            quizForm.querySelectorAll(`.quiz-option-btn[data-group="${group}"]`).forEach(b => {
                b.classList.remove('selected');
            });

            btn.classList.add('selected');
            answers[group] = value;
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
                // Calculate match and show result
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

    // Matching Algorithm
    if (answers.gender === "men") {
        if (answers.vibe === "bold" || answers.occasion === "night") {
            matchedId = "crown-noir"; // Flagship Men's Bold
        } else if (answers.vibe === "fresh") {
            matchedId = "212-vip-men";
        } else {
            matchedId = "azure-vip"; // Flagship Men's Calm
        }
    } else if (answers.gender === "women") {
        if (answers.vibe === "bold" || answers.occasion === "night") {
            matchedId = "onyx-bloom"; // Flagship Women's Bold
        } else if (answers.vibe === "sweet") {
            matchedId = "marshmallow";
        } else if (answers.vibe === "fresh" || answers.vibe === "floral") {
            matchedId = "burberry-weekend";
        } else {
            matchedId = "cashmere-bloom"; // Flagship Women's Elegant
        }
    } else { // unisex
        if (answers.vibe === "bold") {
            matchedId = "obsidian-reef";
        } else if (answers.vibe === "sweet") {
            matchedId = "vanilla-28";
        } else if (answers.vibe === "fresh") {
            matchedId = "ocean-breeze";
        } else {
            matchedId = "coastal-dream";
        }
    }

    const matchedProduct = getProductById(matchedId) || PRODUCTS[0];
    const price10 = matchedProduct.prices["10ml"] ? `Tzs ${matchedProduct.prices["10ml"].toLocaleString('en-US')}` : null;
    const price30 = matchedProduct.prices["30ml"] ? `Tzs ${matchedProduct.prices["30ml"].toLocaleString('en-US')}` : Object.values(matchedProduct.prices)[0].toLocaleString('en-US');

    matchContainer.innerHTML = `
        <div class="match-card">
            <div class="match-badge">⭐ 98% MATCH FOR YOUR PROFILE</div>
            <div class="match-grid">
                <div class="match-image-box">
                    <img src="${matchedProduct.imageUrl}" alt="${matchedProduct.name}">
                </div>
                <div class="match-info">
                    <div class="match-category-tag">${matchedProduct.badge}</div>
                    <h3 class="match-title">${matchedProduct.name}</h3>
                    <p class="match-tagline">${matchedProduct.tagline}</p>
                    <p class="match-desc">${matchedProduct.description}</p>
                    
                    <div class="match-notes">
                        <div class="note-pill"><strong>Top:</strong> ${matchedProduct.notes.top.slice(0, 2).join(', ')}</div>
                        <div class="note-pill"><strong>Heart:</strong> ${matchedProduct.notes.heart.slice(0, 2).join(', ')}</div>
                        <div class="note-pill"><strong>Base:</strong> ${matchedProduct.notes.base.slice(0, 2).join(', ')}</div>
                    </div>

                    <div class="match-pricing">
                        <div class="size-choice-box">
                            <label>Choose Size:</label>
                            <div class="size-buttons" id="quizSizeSelector">
                                ${matchedProduct.prices["10ml"] ? `<button class="size-btn" data-size="10ml">10ml Pocket (${price10})</button>` : ''}
                                ${matchedProduct.prices["30ml"] ? `<button class="size-btn active" data-size="30ml">30ml Full Bottle (Tzs ${price30})</button>` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="match-actions">
                        <button class="btn btn-primary" id="quizAddToCartBtn">
                            🛒 Add to Bag
                        </button>
                        <button class="btn btn-whatsapp" id="quizWhatsAppBtn">
                            💬 Order on WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    quizForm.style.display = 'none';
    quizResult.style.display = 'block';

    let selectedSize = matchedProduct.defaultSize || "30ml";

    // Size button toggle
    matchContainer.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            matchContainer.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.dataset.size;
        });
    });

    // Wire buttons
    const addBtn = document.getElementById('quizAddToCartBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addItemToCart(matchedProduct, selectedSize, 1);
            showToast(`Added ${matchedProduct.name} (${selectedSize}) to bag!`);
            openCartDrawer();
        });
    }

    const waBtn = document.getElementById('quizWhatsAppBtn');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            directWhatsAppOrder(matchedProduct, selectedSize, 1);
        });
    }
}
