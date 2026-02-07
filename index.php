<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CROLA Pierre - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div id="loader">
        <div class="loader-content">
            <div class="terminal-loader">
                <span class="terminal-text">chargement Portfolio</span>
                <span class="cursor">_</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
        </div>
    </div>

    <div class="container">
        <header>
            <h1>Crola Pierre</h1>
            <p class="subtitle">Developer | Designer | Dessinateur</p>
            <nav>
                <a href="#about">à propos</a>
                <a href="#education">Scolarité</a>
                <a href="#projects">Projects</a>
                <a href="#skills">Compétences</a>
                <a href="#contact">Contact</a>
            </nav>
        </header>


        <section id="about">
            <h2>à propos de moi</h2>
            <p>
                Bienvenue sur mon protfolio! je suis un étudiant passioné qui aime créer et innover dans le cadre 
                de projets personnels et professionnel. Je fais de mon mieux pour avoir un code propre et une experience
                 utilisateurs des plus agraébles, je vois le web comme une experience que l'on doit aprécier non comme une 
                 page vide qu'il nous doit subir.
            </p>
        </section>

        <section id="education">
            <h2>Education & diplomes</h2>
            <div class="timeline">
                

                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">2025</div>
                        <h3>BAC général</h3>
                        <p class="institution">Lycée Jeremie de la rue</p>
                        <p>BAC obtenue avec mention assez bien avec les spécialités NSI et AMC.</p>
                        <div class="achievements">
                            <span class="badge">numérique</span>
                            <span class="badge">langue</span>
                        </div>
                    </div>
                </div>


                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">Aujourd'hui</div>
                        <h3>DUT MMI</h3>
                        <p class="institution">IUT de Troyes</p>
                        <p>études de developpement web: métiers du multimédia et de l'internet.</p>
                        <div class="achievements">
                            <span class="badge">création numérique</span>
                            <span class="badge">web</span>
                            <span class="badge">MMI</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <section id="projects">
            <h2>Projects</h2>
            <div class="project-grid">
                <div class="project-card">
                    <h3>Project One</h3>
                    <p>placeholder pour un futur projet </p>
                    <div class="project-links">
                        <a href="#" class="btn">View Demo</a>
                        <a href="#" class="btn-outline">GitHub</a>
                    </div>
                </div>
                <div class="project-card">
                    <h3>Project Two</h3>
                    <p>placeholder pour un futur projet .</p>
                    <div class="project-links">
                        <a href="#" class="btn">View Demo</a>
                        <a href="#" class="btn-outline">GitHub</a>
                    </div>
                </div>
                <div class="project-card">
                    <h3>Project Three</h3>
                    <p>placeholder pour un futur projet</p>
                    <div class="project-links">
                        <a href="#" class="btn">View Demo</a>
                        <a href="#" class="btn-outline">GitHub</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section id="skills">
            <h2>Skills</h2>
            <div class="skills-grid">
                <div class="skill-category">
                    <h3>Frontend</h3>
                    <ul>
                        <li>HTML5 & CSS3</li>
                        <li>JavaScript</li>
                        <li>Vue.js</li>
                    </ul>
                </div>
                <div class="skill-category">
                    <h3>Backend</h3>
                    <ul>
                        <li>Node.js</li>
                        <li>Python</li>
                    </ul>
                </div>
                <div class="skill-category">
                    <h3>Tools</h3>
                    <ul>
                        <li>Git & GitHub</li>
                        <li>VS Code</li>
                        <li>Docker</li>
                        <li>AWS</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="contact">
            <h2>Contactez moi !</h2>
            <p>je suis toujours ouvert à de nouvelles opportunités et collaborations</p>
            <div class="contact-links">
                <a href="mailto:crolap30@gmail.com" class="contact-btn">
                    Email
                </a>
                <a href="https://github.com/yourusername" class="contact-btn">
                     GitHub
                </a>
                <a href="https://linkedin.com/in/yourusername" class="contact-btn">
                     LinkedIn
                </a>
            </div>
        </section>


<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h3>Crola Pierre</h3>
            <p class="footer-description">
                étudiant en BUT MMI<br>
                Passionée par le web et la création digital
            </p>
        </div>

        <div class="footer-section">
            <h3>Navigation</h3>
            <nav class="footer-nav">
                <a href="#about">à propos</a>
                <a href="#education">Scolarité</a>
                <a href="#projects">Projects</a>
                <a href="#skills">Compétences</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>

        <div class="footer-section">
            <h3>Contact</h3>
            <div class="footer-contact">
                <a href="mailto:your.email@example.com">crolap30@gmail.com</a>
                <a href="https://github.com/yourusername">GitHub</a>
                <a href="https://www.linkedin.com/in/pierre-crola-9a34913ab/">LinkedIn</a>
                <a href="tel:+33608375246">+33 6 08 37 52 46  </a>
            </div>
        </div>
    </div>
    
    </footer>
    </div>

    <script src="script.js"></script>
</body>
</html>