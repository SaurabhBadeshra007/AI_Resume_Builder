// generate resume button
document
    .getElementById("generateBtn")
    .addEventListener("click", async function () {
        // Use .value (lowercase) for all input/textarea elements
        const apiKey = document.getElementById("apiKey").value.trim();
        const resumeType = document.getElementById("resumeType").value;
        const personalInfo = document.getElementById("personalInfo").value;
        const education = document.getElementById("education").value;
        const experience = document.getElementById("experience").value;
        const projects = document.getElementById("projects").value;
        const skills = document.getElementById("skills").value;
        const extra = document.getElementById("extra").value;

        if (!apiKey) {
            alert("Please Enter your Gemini API Key");
            return;
        }

        if (!personalInfo || !education || !skills) {
            alert("please fill Personal info , Education & Skill Section");
            return;
        }


        document.getElementById("loading").classList.add("active");
        this.disabled = true;

        const prompt = `Act as an expert recruiter. Create a ${resumeType} resume. the resume should follow this exact structure & styling (matching Latex academic style) 
    Personal Info: ${personalInfo}. 
    Resume type: ${resumeType}
    Education: ${education}
    Experience: ${experience || "Fresher"}
    Projects:${projects}
    Skills: ${skills}
        Extra-Curricular: ${extra}

        CRITICAL REQUIREMENTS: 
        1. Output ONLY the HTML content that goes inside the resumePreview div (no <html> ,<head> or <body> tags)
        2. Use this exact structure:
    -Header with name (large, small-caps, letter-spaced), contact info centered
    -Education section with university, degree in italics, dates right-aligned
    -Relevant Coursework in 2-column bullet list if applicable
    -Experience section with company name bold, job title in italics, dates right-aligned, location right-aligned in italics, bullet points
    -Projects section with project name bold, tech stack in italics,dates,right aligned , bullet-points
    -Technical skills section with categories (Languages , Developer tools, Technologies/Framework)
    -Extra curricular section if provided
    Use ATS-friendly keywords and a professional tone.
    
    3. use exact CSS classes (already defined in the pages):
    - .resume-header, .resume-name, .resume-contact
    - .resume-section, .resume-section-title
    - .resume-item, .resume-item-header, .resume-item-subtitle, .resume-item-location
    - .resume-list (for bullet points)
    - .coursework-grid (for coursework - 2 column)
    - .skills-section , .skill-item , .skill-label
    
    4. Format requirements:
     - use <ul class="resume-list"> for bullet points
     - Right align all dates in resume in .resume-item-header using span
     -Bold for company/project name
     - Italics for job titles , tech-stacks, degree-name and locations
     -keep content concise and achievment focused 
     - use action verb for bullet points
    -for contact info , use symbols: 📞for phone , ✉️for mail, 🔗for LinkedIn, 🛡️for Github , 🌐 for website/portfolio

    5. Make the content professional , quantifiable (use numbers/metrices where possible), and tailford to the ${resumeType} role

    Example structure:
    <div "resume-header">
    <div class="resume-name">First last</div>
    <div class="resume-contact">Address</div>
    <div class="resume-contact">📞for phone , ✉️for mail, 🔗for LinkedIn, 🛡️for Github , 🌐 for website/portfolio</div>
    </div>

    <div class="resume-section">
    <div class="resume-section-title">Education</div>
    <div class="resume-item">
    <div class="resume-item-header">
    <span><strong>University name</strong></span>
    <span> Eduation Duration </span>
    </div>

    <div class="resume-item-subtitle"> bachelor of Technology In Computer Science</div>
    <div class="resume-item-location">City,State</div>
        </div>
        <div class="resume-section-title">Relevant Coursework</div>
        <ul class="coursework-grid">
        <li>Data Structure</li>
        <li>Algorithm Analysis</li>        
        </ul>
    </div>
    Generate the HTML bow (remeber : content only, no HTML document structure):    `;


        try {
            // Using the exact curl pattern you provided
            const response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "x-goog-api-key": apiKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: prompt,
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    "API Error: " +
                    response.status +
                    " - " +
                    (errorData.error?.message || "Unknown error")
                );
            }

            const data = await response.json();

            // Extract the text from response
            const resumeHTML = data.candidates[0].content.parts[0].text;

            // Clean up the response (remove markdown code blocks if present)
            let cleanHTML = resumeHTML.replace(/```html\n?/g, "").replace(/```\n?/g, "");

            document.getElementById("resumePreview").innerHTML = cleanHTML;
        } catch (error) {
            alert(
                "Error generating resume: " +
                error.message +
                "\n\nPlease check your API key and try again."
            );
            console.error("Error:", error);
        } finally {
            document.getElementById("loading").classList.remove("active");
            this.disabled = false;
        }

        // Download PDF Button
        document.getElementById("downloadBtn").addEventListener("click", function () {
            window.print();
        });

        // Copy HTML Button
        document.getElementById("copyBtn").addEventListener("click", function () {
            const resumeContent = document.getElementById("resumePreview").innerHTML;

            if (!resumeContent || resumeContent.includes("Fill out the form")) {
                alert("Please generate a resume first!");
                return;
            }

            const fullHTML =
                '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Resume</title>\n    <link rel="stylesheet" href="resume.css">\n</head>\n<body>\n' +
                resumeContent +
                "\n</body>\n</html>";

            const resumeCSS = `body {
font-family: 'Computer Modern', 'Times New Roman', serif;
line-height: 1.4;
font-size: 11pt;
max-width: 800px;
margin: 20px auto;
padding: 40px;
}

.resume-header {
text-align: center;
margin-bottom: 15px;
border-bottom: 1px solid #000;
padding-bottom: 10px;
}

.resume-name {
font-size: 28pt;
font-weight: normal;
letter-spacing: 3px;
margin-bottom: 5px;
font-variant: small-caps;
}

.resume-contact {
font-size: 10pt;
margin: 5px 0;
}

.resume-contact a {
color: #000;
text-decoration: none;
margin: 0 10px;
}

.resume-section {
margin: 15px 0;
}

.resume-section-title {
font-size: 14pt;
font-weight: bold;
border-bottom: 1px solid #000;
margin: 12px 0 8px 0;
padding-bottom: 2px;
}

.resume-item {
margin: 10px 0;
}

.resume-item-header {
display: flex;
justify-content: space-between;
font-weight: bold;
margin-bottom: 2px;
}

.resume-item-subtitle {
font-style: italic;
margin-bottom: 5px;
}

.resume-item-location {
font-style: italic;
text-align: right;
font-size: 10pt;
}

.resume-list {
margin-left: 20px;
margin-top: 5px;
list-style: none;
}

.resume-list li {
margin: 3px 0;
text-indent: -20px;
padding-left: 20px;
}

.resume-list li:before {
content: "• ";
}

.coursework-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 5px;
margin-left: 20px;
list-style: none;
}

.coursework-grid li:before {
content: "• ";
}

.skill-item {
margin: 5px 0;
}

.skill-label {
font-weight: bold;
}`;

            // Create a downloadable package
            const blob = new Blob(
                [
                    "=== RESUME HTML (save as resume.html) ===\n\n",
                    fullHTML,
                    "\n\n=== RESUME CSS (save as resume.css) ===\n\n",
                    resumeCSS,
                ],
                { type: "text/plain" }
            );

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resume-files.txt";
            a.click();
            URL.revokeObjectURL(url);

            alert(
                "Resume files downloaded! The TXT file contains both HTML and CSS. Copy each section into separate files:\n\n1. resume.html\n2. resume.css"
            );
        });
    });