/**
 * LOGIC PREDIKSI VITAL SENSE AI
 * Model: Logistic Regression
 * Dataset: Heart Failure Clinical Records
 * Training Source: Python (Scikit-Learn)
 */

// 1. Konstanta dari hasil Training Python (JANGAN DIUBAH)
const MODEL_PARAMS = {
  intercept: -1.6207563619567413,
  features: [
    "age",
    "anaemia",
    "creatinine_phosphokinase",
    "diabetes",
    "ejection_fraction",
    "high_blood_pressure",
    "platelets",
    "serum_creatinine",
    "serum_sodium",
    "sex",
    "smoking",
    "time",
  ],
  // Urutan array harus sama persis dengan urutan fitur di atas
  means: [
    61.064158995815895, 0.4351464435146444, 577.0836820083682,
    0.40585774058577406, 38.26359832635983, 0.3514644351464435,
    262427.45020920504, 1.3873640167364019, 136.418410041841,
    0.6443514644351465, 0.3138075313807531, 132.29707112970712,
  ],
  scales: [
    11.98137291466746, 0.4957761755179456, 944.95435750474, 0.49105726243726866,
    11.626760595602065, 0.4774276761705745, 94075.06609085672,
    0.9928915536785942, 4.430853689486908, 0.4787093635134252,
    0.4640391843685948, 78.18677102278771,
  ],
  coefficients: [
    0.6614, -0.0519, 0.1107, 0.1645, -0.8766, -0.0604, -0.1694, 0.702, -0.2604,
    -0.3628, 0.0716, -1.6512,
  ],
};

/**
 * Fungsi Sigmoid untuk mengubah Log-Odds menjadi Probabilitas (0 - 1)
 */
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Fungsi Utama Prediksi
 * @param {Object} inputData - Object berisi data pasien (key harus sama dengan features)
 */
export function predictMortalityRisk(inputData) {
  let logOdds = MODEL_PARAMS.intercept;
  let explanation = []; // Untuk fitur Explainable AI

  // Loop setiap fitur untuk menghitung bobot
  MODEL_PARAMS.features.forEach((feature, index) => {
    // 1. Ambil nilai input (default 0 jika kosong)
    const rawValue = parseFloat(inputData[feature]) || 0;

    // 2. Standarisasi (Standard Scaler): (Value - Mean) / Scale
    const standardizedValue =
      (rawValue - MODEL_PARAMS.means[index]) / MODEL_PARAMS.scales[index];

    // 3. Hitung kontribusi: Standardized Value * Coefficient
    const contribution = standardizedValue * MODEL_PARAMS.coefficients[index];

    // 4. Tambahkan ke total Log Odds
    logOdds += contribution;

    // Simpan kontribusi untuk "Explainable AI" (Kenapa risikonya tinggi?)
    // Simpan yang kontribusinya besar saja
    if (Math.abs(contribution) > 0.3) {
      explanation.push({
        feature: feature,
        impact: contribution > 0 ? "Increases Risk" : "Decreases Risk",
        value: rawValue,
        weight: contribution.toFixed(2),
      });
    }
  });

  // 5. Konversi ke Probabilitas (Persen)
  const probability = sigmoid(logOdds);
  const riskPercentage = (probability * 100).toFixed(1);

  // 6. Tentukan Level Risiko
  let riskLevel = "Low";
  if (probability > 0.7) riskLevel = "Critical";
  else if (probability > 0.4) riskLevel = "High";
  else if (probability > 0.2) riskLevel = "Moderate";

  return {
    probability: probability,
    riskScore: riskPercentage, // String "85.5"
    riskLevel: riskLevel, // "High", "Low", etc.
    explanation: explanation.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)), // Urutkan dari dampak terbesar
  };
}