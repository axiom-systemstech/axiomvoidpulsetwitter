// ============================================
// AXIOM VOID PULSE TWITTER UI v1.0
// ============================================

(function() {
    const tweetInput = document.getElementById('tweetInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultContainer = document.getElementById('resultContainer');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const enhanceBtn = document.getElementById('enhanceBtn');
    
    const ratioRiskSpan = document.getElementById('ratioRisk');
    const backlashRiskSpan = document.getElementById('backlashRisk');
    const toxicityScoreSpan = document.getElementById('toxicityScore');
    const viralityScoreSpan = document.getElementById('viralityScore');
    
    let currentAnalysis = null;
    let currentText = "";
    
    // Palabras para detección
    const HATE_WORDS = ['odio', 'puta', 'mierda', 'imbécil', 'basura', '💢', '🤬', 'detesto', 'asco', 'fascista', 'nazi', 'comunista', 'racista', 'feminista', 'machista'];
    const VIRAL_WORDS = ['🔥', '🚀', '💣', 'nuevo', 'descubrimiento', 'revolucionario', 'exclusiva', 'nunca antes', 'increíble', 'impactante'];
    const POSITIVE_WORDS = ['gracias', 'amor', '❤️', 'feliz', 'genial', 'excelente', 'maravilloso', 'increíble', 'disfrutar'];
    const MANIPULATION_WORDS = ['deberías', 'tienes que', 'es obligatorio', 'necesitas', 'todos deben'];
    const URGENCY_WORDS = ['ahora', 'inmediato', 'urgente', 'ya', 'rápido', 'antes de que', 'último día'];
    
    function extractTextFromUrl(url) {
        // Si es una URL de X, intentamos extraer el texto (simulado)
        // En producción, esto requeriría scraping real
        if (url.includes('x.com') || url.includes('twitter.com')) {
            return null; // Por ahora, simulamos que no podemos extraer
        }
        return url;
    }
    
    function analyzeTweet(text) {
        if (!text || text.trim().length === 0) {
            return {
                ratioRisk: "—",
                backlash: "—",
                toxicity: "—",
                virality: "—",
                analysis: "// Introduce un tweet para analizar",
                suggestions: [],
                enhanced: ""
            };
        }
        
        const lowerText = text.toLowerCase();
        
        // Calcular toxicidad
        let toxicity = 0;
        let hateCount = 0;
        for (let word of HATE_WORDS) {
            if (lowerText.includes(word)) {
                hateCount++;
                toxicity += 25;
            }
        }
        toxicity = Math.min(toxicity, 100);
        
        // Calcular viralidad
        let virality = 20;
        for (let word of VIRAL_WORDS) {
            if (lowerText.includes(word)) virality += 15;
        }
        const hashtags = (text.match(/#\w+/g) || []).length;
        virality += hashtags * 5;
        const mentions = (text.match(/@\w+/g) || []).length;
        virality += mentions * 3;
        if (text.length >= 50 && text.length <= 150) virality += 10;
        virality = Math.min(virality, 100);
        
        // Calcular riesgo de ratio (basado en toxicidad)
        let ratioRisk = 0;
        if (toxicity >= 70) ratioRisk = 85;
        else if (toxicity >= 40) ratioRisk = 55;
        else if (toxicity >= 20) ratioRisk = 30;
        else ratioRisk = 10;
        
        // Ajustar por mayúsculas y signos
        const upperCount = (text.match(/[A-Z]{3,}/g) || []).length;
        ratioRisk += upperCount * 5;
        const exclamCount = (text.match(/!{2,}/g) || []).length;
        ratioRisk += exclamCount * 8;
        ratioRisk = Math.min(ratioRisk, 100);
        
        // Calcular backlash
        let backlash = 0;
        for (let word of HATE_WORDS) {
            if (lowerText.includes(word)) backlash += 18;
        }
        backlash = Math.min(backlash, 100);
        
        let backlashLevel = "bajo";
        if (backlash >= 60) backlashLevel = "alto";
        else if (backlash >= 30) backlashLevel = "medio";
        
        // Generar sugerencias
        let suggestions = [];
        if (toxicity > 50) suggestions.push("⚠️ Evita lenguaje agresivo o palabras que puedan ofender.");
        if (ratioRisk > 60) suggestions.push("📉 Alto riesgo de ratio. Suaviza el tono o añade contexto.");
        if (virality < 40) suggestions.push("📈 Añade emojis, hashtags o un gancho para más impacto.");
        if (text.length > 240) suggestions.push("📝 El tweet es muy largo. Acórtalo para mejor engagement.");
        if (text.length < 30) suggestions.push("✏️ El tweet es muy corto. Añade más valor o contexto.");
        if (upperCount > 2) suggestions.push("🔇 Evita MAYÚSCULAS excesivas (parece que gritas).");
        if (exclamCount > 2) suggestions.push("❗ Demasiadas exclamaciones. Reduce para sonar más natural.");
        
        // Versión mejorada
        let enhanced = text;
        if (toxicity > 50) {
            enhanced = enhanced.replace(/odio/gi, 'no me convence');
            enhanced = enhanced.replace(/mierda/gi, 'no es lo mejor');
            enhanced = enhanced.replace(/puta/gi, 'muy mal');
        }
        if (enhanced.length < 30 && !enhanced.includes('?')) {
            enhanced = enhanced + ' ¿Qué opinas?';
        }
        if (virality < 30 && !enhanced.includes('🔥')) {
            enhanced = enhanced + ' 🔥';
        }
        
        // Resultado formateado
        let analysis = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        analysis += `📊 ANÁLISIS DEL TWEET\n`;
        analysis += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        analysis += `📝 Texto original:\n"${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"\n\n`;
        analysis += `⚠️ Toxicidad: ${toxicity}%\n`;
        analysis += `📈 Viralidad: ${virality}%\n`;
        analysis += `💢 Riesgo Ratio: ${ratioRisk}%\n`;
        analysis += `🔨 Backlash: ${backlashLevel.toUpperCase()} (${backlash}%)\n\n`;
        
        if (suggestions.length > 0) {
            analysis += `💡 SUGERENCIAS:\n`;
            suggestions.forEach(s => { analysis += `   ${s}\n`; });
            analysis += `\n`;
        }
        
        analysis += `✨ VERSIÓN MEJORADA:\n"${enhanced}"\n\n`;
        analysis += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        analysis += `💡 Recomendación final: `;
        
        if (ratioRisk > 70) analysis += `NO POSTEES ESTO. Revísalo antes.`;
        else if (ratioRisk > 40) analysis += `Puedes postearlo, pero con cuidado.`;
        else analysis += `Tweet seguro. Puedes postear con confianza.`;
        
        return {
            ratioRisk: `${ratioRisk}%`,
            backlash: backlashLevel.toUpperCase(),
            toxicity: `${toxicity}%`,
            virality: `${virality}%`,
            analysis: analysis,
            suggestions: suggestions,
            enhanced: enhanced,
            ratioValue: ratioRisk,
            toxicityValue: toxicity
        };
    }
    
    function getRiskClass(value) {
        if (value >= 60) return 'risk-high';
        if (value >= 30) return 'risk-mid';
        return 'risk-low';
    }
    
    function updateUI(result) {
        if (!result) return;
        
        ratioRiskSpan.innerText = result.ratioRisk;
        ratioRiskSpan.className = `stat-number ${getRiskClass(result.ratioValue)}`;
        
        backlashRiskSpan.innerText = result.backlash;
        if (result.backlash === 'ALTO') backlashRiskSpan.className = 'stat-number risk-high';
        else if (result.backlash === 'MEDIO') backlashRiskSpan.className = 'stat-number risk-mid';
        else backlashRiskSpan.className = 'stat-number risk-low';
        
        toxicityScoreSpan.innerText = result.toxicity;
        toxicityScoreSpan.className = `stat-number ${getRiskClass(result.toxicityValue)}`;
        
        viralityScoreSpan.innerText = result.virality;
        
        resultContainer.innerHTML = `<div class="result-content">${result.analysis.replace(/\n/g, '<br>')}</div>`;
    }
    
    function analyze() {
        let input = tweetInput.value.trim();
        if (!input) {
            resultContainer.innerHTML = '<div class="placeholder">// Introduce un tweet para analizar</div>';
            return;
        }
        
        // Si parece una URL de X, intentamos extraer (simulado)
        if (input.includes('x.com') || input.includes('twitter.com')) {
            resultContainer.innerHTML = '<div class="placeholder">// 🔄 Extrayendo tweet de X... (simulado)\n// En la versión completa se extrae automáticamente</div>';
            setTimeout(() => {
                resultContainer.innerHTML = '<div class="placeholder">// No se pudo extraer el tweet automáticamente\n// Escribe el texto manualmente o usa la versión Enterprise</div>';
            }, 1000);
            return;
        }
        
        const result = analyzeTweet(input);
        currentAnalysis = result;
        currentText = input;
        updateUI(result);
    }
    
    function copyResult() {
        if (!currentAnalysis) {
            alert("Analiza un tweet primero");
            return;
        }
        navigator.clipboard.writeText(currentAnalysis.analysis);
        copyResultBtn.innerText = "✓ Copiado!";
        setTimeout(() => { copyResultBtn.innerText = "📋 Copiar análisis"; }, 2000);
    }
    
    function enhanceTweet() {
        if (!currentAnalysis || !currentText) {
            alert("Analiza un tweet primero");
            return;
        }
        
        navigator.clipboard.writeText(currentAnalysis.enhanced);
        enhanceBtn.innerText = "✓ Copiado!";
        setTimeout(() => { enhanceBtn.innerText = "✨ VERSIÓN MEJORADA"; }, 2000);
        alert("Versión mejorada copiada al portapapeles");
    }
    
    // Eventos
    analyzeBtn.addEventListener('click', analyze);
    copyResultBtn.addEventListener('click', copyResult);
    enhanceBtn.addEventListener('click', enhanceTweet);
    
    // Enter para analizar
    tweetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyze();
    });
    
    // Ejemplos rápidos
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tweetInput.value = btn.innerText;
            analyze();
        });
    });
    
    // Tema oscuro/claro
    const themeToggle = document.getElementById('themeToggle');
    const htmlTag = document.documentElement;
    themeToggle.addEventListener('click', () => {
        const isDark = htmlTag.getAttribute('data-theme') === 'dark';
        htmlTag.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggle.innerText = isDark ? '☀️' : '🌙';
    });
    
    // Demo inicial
    tweetInput.value = "Me encanta este producto es increíble 🔥";
    analyze();
    
    console.log("🚀 VOID PULSE TWITTER UI - Inicializado");
})();