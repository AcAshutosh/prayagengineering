const fs = require('fs');

const replacement = `  <script src="assets/config.js"></script>
  <script>
    const safeSetText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const safeSetSrc = (id, src) => { const el = document.getElementById(id); if (el) el.src = src; };

    safeSetText("configGstin", siteConfig.topBar.gstin);
    safeSetText("configTagline", siteConfig.topBar.text);
    safeSetText("configYear", siteConfig.footer.year);
    safeSetText("configFooterText", siteConfig.footer.text);
    safeSetSrc("configMap", siteConfig.contact.mapEmbedUrl);

    const slider = document.getElementById("heroSlider");
    if (slider) {
      siteConfig.heroImages.forEach((img, idx) => {
        const div = document.createElement("div");
        div.className = \`slide \${idx === 0 ? "active" : ""}\`;
        div.style.backgroundImage = \`url('\${img}')\`;
        slider.appendChild(div);
      });
      let currentSlide = 0;
      setInterval(() => {
        const slides = document.querySelectorAll(".slide");
        if(slides.length > 0) {
          slides[currentSlide].classList.remove("active");
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].classList.add("active");
        }
      }, 5000);
    }

    const sGrid = document.getElementById("servicesGrid");
    const userServiceSelect = document.getElementById("userService");
    
    siteConfig.services.forEach((s) => {
      if (sGrid) {
        sGrid.innerHTML += \`<div class="service-card reveal" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
  <div style="height: 220px; background: url('\${s.img || "assets/images/industrial_bg.png"}') center/cover; position: relative;">
    <div style="position: absolute; inset: 0; background: linear-gradient(to top, var(--glass), transparent);"></div>
  </div>
  <div style="padding: 30px; flex: 1; display: flex; flex-direction: column;">
    <h3 style="margin-bottom:10px; font-weight:800; font-size: 20px; color: var(--accent);">\${s.title}</h3>
    <p style="color:var(--muted); font-size:14px; margin-bottom: 20px; line-height: 1.6;">\${s.shortDesc || ""}</p>
    <div style="flex: 1;">\${s.desc}</div>
    <a href="contact.html" class="cta" style="margin-top: 25px; text-align: center; width: 100%; display: block; border: 1px solid var(--accent); background: transparent; color: var(--accent);">Consult Now</a>
  </div>
</div>\`;
      }
      if (userServiceSelect) {
        const opt = document.createElement("option");
        opt.value = s.title;
        opt.textContent = s.title;
        userServiceSelect.appendChild(opt);
      }
    });

    safeSetText("contactPhone", siteConfig.contact.phone);
    safeSetText("contactEmail", siteConfig.contact.email);
    safeSetText("contactAddress", siteConfig.contact.address);

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMenu = document.getElementById("navMenu");
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener("click", () => navMenu.classList.toggle("nav-active"));
      navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => navMenu.classList.remove("nav-active")));
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      let captchaNum1 = 0, captchaNum2 = 0;
      function generateCaptcha() {
        captchaNum1 = Math.floor(Math.random() * 10) + 1;
        captchaNum2 = Math.floor(Math.random() * 10) + 1;
        document.getElementById("captchaQuestion").innerText = \`\${captchaNum1} + \${captchaNum2} =\`;
        document.getElementById("captchaAnswer").value = "";
      }
      generateCaptcha();

      const formStatus = document.getElementById("formStatus");
      const submitBtn = document.getElementById("submitBtn");

      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const userAnswer = parseInt(document.getElementById("captchaAnswer").value, 10);
        if (userAnswer !== captchaNum1 + captchaNum2) {
          formStatus.style.display = "block"; formStatus.style.color = "#ff4444";
          formStatus.innerText = "Incorrect CAPTCHA answer. Please try again.";
          generateCaptcha(); return;
        }

        formStatus.style.display = "block"; formStatus.style.color = "#4caf50";
        formStatus.innerText = "Sending message...";
        submitBtn.disabled = true; submitBtn.innerText = "Sending...";

        const targetEmail = "engineeringprayag33+hr@gmail.com";
        const payload = {
          name: document.getElementById("userName").value, company: document.getElementById("userCompany").value,
          email: document.getElementById("userEmail").value, phone: document.getElementById("userPhone").value,
          service: document.getElementById("userService").value, message: document.getElementById("userMessage").value,
          _subject: "New Website Form Submission!"
        };

        fetch(\`https://formsubmit.co/ajax/\${targetEmail}\`, {
          method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          formStatus.style.color = "#4caf50"; formStatus.innerText = "Message sent successfully!";
          contactForm.reset(); generateCaptcha(); submitBtn.disabled = false; submitBtn.innerText = "Submit Request";
        })
        .catch(error => {
          formStatus.style.color = "#ff4444"; formStatus.innerText = "Network error. Failed to send message.";
          generateCaptcha(); submitBtn.disabled = false; submitBtn.innerText = "Submit Request";
        });
      });
    }
  </script>`;

const files = ['index.html', 'about.html', 'services.html', 'contact.html'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Use Regex to replace from <script src="assets/config.js"></script> to the end of the next </script>
  content = content.replace(/<script src="assets\/config\.js"><\/script>\s*<script>[\s\S]*?<\/script>/, replacement);
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}
