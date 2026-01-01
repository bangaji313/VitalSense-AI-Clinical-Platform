import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Fungsi Mapping yang LEBIH KUAT (Anti Error)
const mapToFHIR = (id, data) => {
  // Safe Guards: Pastikan data tidak undefined
  const fullName = data.name || "Unknown Patient";
  const names = fullName.split(" ");
  const firstName = names[0] || "Unknown";
  const familyName = names.length > 1 ? names.slice(1).join(" ") : names[0];
  
  // Pastikan angka adalah angka
  const age = Number(data.age) || 0;
  const riskScore = parseFloat(data.risk_score) || 0;

  return {
    resourceType: "Patient",
    id: id,
    active: true,
    identifier: [
      {
        use: "official",
        system: "http://hospital.id/mrn",
        value: id
      }
    ],
    name: [
      {
        use: "official",
        family: familyName,
        given: [firstName]
      }
    ],
    gender: data.sex === 1 ? "male" : "female",
    birthDate: `${2025 - age}-01-01`, 
    extension: [
      {
        url: "http://vitalsense.ai/fhir/risk-score",
        valueDecimal: riskScore
      },
      {
        url: "http://vitalsense.ai/fhir/risk-level",
        valueString: data.status || "Unknown"
      }
    ],
    telecom: [
      {
        system: "email",
        value: "patient@example.com"
      }
    ],
    meta: {
      lastUpdated: new Date().toISOString(),
      source: "VitalSense AI API v2.1"
    }
  };
};

export async function GET(request, { params }) {
  // PENTING: Await params di Next.js versi terbaru
  const { id } = await params; 

  console.log(`[API] Fetching Patient ID: ${id}`); // Log ke Terminal VS Code

  try {
    const docRef = doc(db, "patients", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log(`[API] Patient Not Found: ${id}`);
      return NextResponse.json(
        { error: "Patient Resource Not Found", resourceType: "OperationOutcome" },
        { status: 404 }
      );
    }

    const patientData = docSnap.data();
    console.log("[API] Data Found:", patientData.name); // Cek apakah data terbaca

    const fhirResource = mapToFHIR(docSnap.id, patientData);

    return NextResponse.json(fhirResource, {
      status: 200,
      headers: {
        "Content-Type": "application/fhir+json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    // Ini akan muncul di Terminal VS Code Mas Seno, kasih tau error detailnya apa
    console.error("[API CRITICAL ERROR]:", error);
    
    return NextResponse.json(
      { 
        error: "Internal Server Error", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}