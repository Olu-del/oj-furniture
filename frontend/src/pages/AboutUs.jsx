// Static About page content for OJ Furniture
export default function AboutUs() {
  return (
    <div className="page about-page">
      <h2>About OJ Furniture</h2>

      <p>
        OJ Furniture is a fictional e‑commerce platform created as part of a 
        final‑year Creative Computing project at 
        <strong> Goldsmiths, University of London</strong>. 
        This website is not a real online store and does not facilitate actual 
        purchases, deliveries, or commercial transactions.
      </p>

      <p>
        The project was designed to explore full‑stack development, user‑centred 
        design, database integration, cloud deployment, and the technical 
        challenges involved in building a modern e‑commerce experience.
      </p>

      <div className="about-highlight">
        <strong>Project Purpose:</strong> To demonstrate practical skills in 
        frontend development, backend engineering, database management, and 
        cloud deployment as part of a degree‑show portfolio.
      </div>

      <h3>What This Project Showcases</h3>
      <ul>
        <li>Full‑stack development using React, Node.js, Express, and Prisma.</li>
        <li>Cloud deployment using Render (frontend + backend) and Railway (database).</li>
        <li>Realistic e‑commerce features such as product browsing, cart management, 
            checkout flow, order tracking, and email notifications.</li>
        <li>User‑centred design with a focus on clarity, accessibility, and smooth navigation.</li>
      </ul>

      <h3>Why “OJ Furniture”?</h3>
      <p>
        The concept of a second‑hand furniture store was chosen to reflect themes of 
        sustainability, affordability, and reuse — values that align with modern 
        digital retail trends and provide a meaningful context for demonstrating 
        technical skills.
      </p>

      <h3>A Note to Visitors</h3>
      <p>
        While the website looks and behaves like a real online store, all products, 
        orders, and transactions are simulated for educational purposes only. 
        No real payments, deliveries, or customer services are provided.
      </p>

      <p>
        Thank you for visiting this project as part of the Goldsmiths Degree Show. 
        Your time, feedback, and engagement are greatly appreciated.
      </p>
    </div>
  );
}
