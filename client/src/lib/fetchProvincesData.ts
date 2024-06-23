export async function fetchProvincesData() {
  try {
    const response = await fetch("http://localhost:3000/api/province-data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching province data:", error);
    return [];
  }
}
