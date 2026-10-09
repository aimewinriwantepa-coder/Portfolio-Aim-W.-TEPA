/* ==================================================
   PORTFOLIO — Aimé W. TEPA
   --------------------------------------------------
   Ce fichier contient le comportement et les animations
   du site : menu mobile, apparitions au défilement,
   compteurs, lueur des cartes, bande d'outils, barre
   de progression, formulaire, CV, e-mail, réseaux, avis.

   Pour modifier quelque chose, change uniquement
   les valeurs de la section RÉGLAGES ci-dessous.
================================================== */

/* ==================================================
   RÉGLAGES (à modifier selon tes besoins)
================================================== */
const REGLAGES = {

    // ----- ANIMATIONS -----

    // true = toutes les animations de défilement sont actives, false = site sans animation.
    // (Elles se coupent aussi toutes seules si l'appareil demande moins de mouvement.)
    animations: true,

    // Largeur d'écran (en pixels) en dessous de laquelle le menu devient un bouton.
    // Doit rester identique à la valeur 900px du fichier style.css.
    largeurMenuMobile: 900,

    // Distance de défilement (en pixels) à partir de laquelle l'en-tête devient vitré.
    seuilEnTete: 10,

    // Distance de défilement (en pixels) à partir de laquelle la flèche "remonter" apparaît.
    seuilRetourHaut: 400,

    // ----- WHATSAPP ET FORMULAIRE -----

    // Message pré-rempli quand quelqu'un clique sur un bouton WhatsApp.
    // Mets "" (vide) pour ne pré-remplir aucun message.
    messageWhatsApp: "Bonjour Aimé, je vous contacte depuis votre portfolio.",

    // Texte au début du message envoyé depuis le formulaire de contact.
    introFormulaire: "Bonjour Aimé, je vous écris depuis votre portfolio.",

    // ----- INFORMATIONS À AJOUTER (elles apparaissent seules sur le site) -----

    // Ton CV : mets le chemin du fichier, par exemple "cv/CV-Aime-TEPA.pdf".
    // Laisse "" tant que tu n'as pas le fichier : le bouton reste caché.
    cv: "",

    // Ton adresse e-mail, par exemple "prenom@exemple.com". Laisse "" pour ne rien afficher.
    email: "",

    // Tes réseaux sociaux. Retire les // devant une ligne et complète l'adresse.
    reseaux: [
        // { nom: "LinkedIn", url: "https://www.linkedin.com/in/ton-profil" },
        // { nom: "Facebook", url: "https://www.facebook.com/ton-profil" },
        // { nom: "Instagram", url: "https://www.instagram.com/ton-profil" }
    ],

    // Avis de vrais clients (avec leur accord). Tant que la liste est vide,
    // la section "Ils m'ont fait confiance" reste cachée.
    avis: [
        // { texte: "Travail soigné et livré dans les délais.", nom: "Prénom Nom", role: "Entreprise ou fonction" }
    ]
};


/* ==================================================
   OUTILS
================================================== */
const $ = (selecteur, parent = document) => parent.querySelector(selecteur);
const $$ = (selecteur, parent = document) => Array.from(parent.querySelectorAll(selecteur));

// Animations actives ? (réglage + préférence de l'appareil + navigateur compatible)
const ANIMATIONS_ACTIVES =
    REGLAGES.animations &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window;


/* ==================================================
   1. MENU MOBILE
================================================== */
function initialiserMenu() {
    const bouton = $(".menu-toggle");
    const menu = $("#menu");

    if (!bouton || !menu) return;

    const ouvrir = () => {
        menu.classList.add("is-open");
        bouton.setAttribute("aria-expanded", "true");
    };

    const fermer = () => {
        menu.classList.remove("is-open");
        bouton.setAttribute("aria-expanded", "false");
    };

    bouton.addEventListener("click", () => {
        const estOuvert = bouton.getAttribute("aria-expanded") === "true";
        estOuvert ? fermer() : ouvrir();
    });

    $$("a", menu).forEach((lien) => lien.addEventListener("click", fermer));

    document.addEventListener("keydown", (evenement) => {
        if (evenement.key === "Escape" && menu.classList.contains("is-open")) {
            fermer();
            bouton.focus();
        }
    });

    document.addEventListener("click", (evenement) => {
        const dansLeMenu = menu.contains(evenement.target) || bouton.contains(evenement.target);
        if (!dansLeMenu) fermer();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > REGLAGES.largeurMenuMobile) fermer();
    });
}


/* ==================================================
   2. EN-TÊTE VITRÉ ET BARRE DE PROGRESSION
================================================== */
function initialiserDefilement() {
    const enTete = $(".site-header");

    // Barre de progression de lecture, en haut de la page
    let barre = null;
    if (ANIMATIONS_ACTIVES) {
        barre = document.createElement("div");
        barre.className = "progress";
        barre.setAttribute("aria-hidden", "true");
        document.body.appendChild(barre);
    }

    const mettreAJour = () => {
        if (enTete) {
            enTete.classList.toggle("is-scrolled", window.scrollY > REGLAGES.seuilEnTete);
        }
        if (barre) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const part = total > 0 ? window.scrollY / total : 0;
            barre.style.transform = "scaleX(" + Math.min(Math.max(part, 0), 1) + ")";
        }
    };

    mettreAJour();
    window.addEventListener("scroll", mettreAJour, { passive: true });
    window.addEventListener("resize", mettreAJour);
}


/* ==================================================
   2 bis. FLÈCHE "REMONTER EN HAUT"
   Apparaît après un peu de défilement, avec un anneau
   qui montre où tu en es dans la page.
================================================== */
function initialiserRetourHaut() {
    const bouton = $(".to-top");
    if (!bouton) return;

    const anneau = $(".ring-fg", bouton);
    const circonference = 138.23; // 2 x pi x rayon (22)

    const mettreAJour = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const part = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;

        bouton.classList.toggle("is-visible", window.scrollY > REGLAGES.seuilRetourHaut);
        if (anneau) anneau.style.strokeDashoffset = circonference * (1 - part);
    };

    bouton.addEventListener("click", (evenement) => {
        evenement.preventDefault();
        const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
    });

    mettreAJour();
    window.addEventListener("scroll", mettreAJour, { passive: true });
    window.addEventListener("resize", mettreAJour);
}


/* ==================================================
   3. PAGE ACTIVE DANS LE MENU
================================================== */
function initialiserPageActive() {
    const pageActuelle = window.location.pathname.split("/").pop() || "index.html";

    $$(".nav-links a").forEach((lien) => {
        const cible = lien.getAttribute("href");

        if (cible === pageActuelle) {
            lien.setAttribute("aria-current", "page");
        } else {
            lien.removeAttribute("aria-current");
        }
    });
}


/* ==================================================
   4. APPARITION AU DÉFILEMENT
   Les éléments marqués data-reveal apparaissent en
   douceur quand ils entrent dans l'écran. Les groupes
   marqués data-stagger apparaissent l'un après l'autre.
   Cette fonction est appelée tout de suite (avant le
   premier affichage) pour éviter un clignotement.
================================================== */
function initialiserApparitions() {
    if (!ANIMATIONS_ACTIVES) return;

    // Décalage entre les éléments d'un même groupe
    $$("[data-stagger]").forEach((groupe) => {
        Array.from(groupe.children).forEach((enfant, index) => {
            enfant.setAttribute("data-reveal", "");
            enfant.style.setProperty("--d", index * 90 + "ms");
        });
    });

    document.documentElement.classList.add("reveal-on");

    const observateur = new IntersectionObserver((entrees, obs) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                entree.target.classList.add("is-in");
                obs.unobserve(entree.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    $$("[data-reveal]").forEach((element) => observateur.observe(element));
}


/* ==================================================
   5. BARRES D'EXPÉRIENCE
   Elles se remplissent une seule fois, à l'arrivée.
================================================== */
function initialiserBarres() {
    const groupes = $$("[data-bars]");
    if (groupes.length === 0) return;

    if (!ANIMATIONS_ACTIVES) {
        groupes.forEach((groupe) => groupe.classList.add("is-visible"));
        return;
    }

    const observateur = new IntersectionObserver((entrees, obs) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                entree.target.classList.add("is-visible");
                obs.unobserve(entree.target);
            }
        });
    }, { threshold: 0.4 });

    groupes.forEach((groupe) => observateur.observe(groupe));
}


/* ==================================================
   6. COMPTEURS
   Les chiffres marqués data-count montent jusqu'à leur
   valeur quand ils deviennent visibles.
   Exemple : <strong data-count="6" data-suffix=" ans">6 ans</strong>
================================================== */
function initialiserCompteurs() {
    if (!ANIMATIONS_ACTIVES) return;

    const compteurs = $$("[data-count]");
    if (compteurs.length === 0) return;

    const afficher = (element, valeur) => {
        element.textContent = Math.round(valeur) + (element.dataset.suffix || "");
    };

    const animer = (element) => {
        const cible = Number(element.dataset.count);
        const duree = 1400;
        const debut = performance.now();

        const etape = (maintenant) => {
            const progression = Math.min((maintenant - debut) / duree, 1);
            const adoucie = 1 - Math.pow(1 - progression, 3);
            afficher(element, cible * adoucie);
            if (progression < 1) requestAnimationFrame(etape);
        };

        requestAnimationFrame(etape);
    };

    const observateur = new IntersectionObserver((entrees, obs) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                animer(entree.target);
                obs.unobserve(entree.target);
            }
        });
    }, { threshold: 0.6 });

    compteurs.forEach((element) => {
        afficher(element, 0);
        observateur.observe(element);
    });
}


/* ==================================================
   7. LUEUR QUI SUIT LA SOURIS SUR LES CARTES
================================================== */
function initialiserProjecteur() {
    if (!ANIMATIONS_ACTIVES) return;

    $$("[data-spot]").forEach((carte) => {
        carte.addEventListener("pointermove", (evenement) => {
            const zone = carte.getBoundingClientRect();
            carte.style.setProperty("--mx", evenement.clientX - zone.left + "px");
            carte.style.setProperty("--my", evenement.clientY - zone.top + "px");
        });
    });
}


/* ==================================================
   8. BANDE D'OUTILS QUI DÉFILE
   Duplique la liste pour que la boucle soit continue.
================================================== */
function initialiserBande() {
    if (!ANIMATIONS_ACTIVES) return;

    $$(".marquee-track").forEach((piste) => {
        const liste = $(".marquee-list", piste);
        if (!liste) return;

        const copie = liste.cloneNode(true);
        copie.setAttribute("aria-hidden", "true");
        piste.appendChild(copie);
        piste.classList.add("is-running");
    });
}


/* ==================================================
   9. LIENS WHATSAPP
   Ajoute le message pré-rempli aux liens marqués
   avec l'attribut data-whatsapp dans le HTML.
================================================== */
function initialiserWhatsApp() {
    if (!REGLAGES.messageWhatsApp) return;

    $$("[data-whatsapp]").forEach((lien) => {
        const base = lien.getAttribute("href").split("?")[0];
        lien.setAttribute("href", base + "?text=" + encodeURIComponent(REGLAGES.messageWhatsApp));
    });
}


/* ==================================================
   10. ANNÉE DU PIED DE PAGE
================================================== */
function initialiserAnnee() {
    $$("[data-year]").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}


/* ==================================================
   11. FILTRE DES PROJETS (page Projets)
================================================== */
function initialiserFiltres() {
    const boutons = $$(".filter");
    const grille = $("[data-projects]");
    if (boutons.length === 0 || !grille) return;

    const projets = $$(".project", grille);
    const messageVide = $("[data-empty]");

    boutons.forEach((bouton) => {
        bouton.addEventListener("click", () => {
            const choix = bouton.dataset.filter;
            let visibles = 0;

            boutons.forEach((b) => {
                const actif = b === bouton;
                b.classList.toggle("is-active", actif);
                b.setAttribute("aria-pressed", String(actif));
            });

            projets.forEach((projet) => {
                const afficher = choix === "tous" || projet.dataset.category === choix;
                projet.hidden = !afficher;
                if (afficher) visibles++;
            });

            if (messageVide) messageVide.hidden = visibles > 0;
        });
    });
}


/* ==================================================
   12. FORMULAIRE DE CONTACT → WHATSAPP
   Vérifie les champs, puis ouvre WhatsApp avec le
   message déjà écrit. Aucun serveur nécessaire.
================================================== */
function initialiserFormulaire() {
    const formulaire = $("[data-whatsapp-form]");
    if (!formulaire) return;

    const zoneErreur = $("[data-form-error]", formulaire);

    formulaire.addEventListener("submit", (evenement) => {
        evenement.preventDefault();

        const champs = ["nom", "besoin", "message"].map((id) => $("#" + id, formulaire));
        const manquants = champs.filter((champ) => champ.value.trim() === "");

        champs.forEach((champ) => champ.classList.toggle("has-error", manquants.includes(champ)));

        if (manquants.length > 0) {
            zoneErreur.textContent = "Merci de remplir tous les champs avant d'envoyer.";
            zoneErreur.hidden = false;
            manquants[0].focus();
            return;
        }

        zoneErreur.hidden = true;

        const [nom, besoin, message] = champs.map((champ) => champ.value.trim());
        const texte = [
            REGLAGES.introFormulaire,
            "",
            "Nom : " + nom,
            "Besoin : " + besoin,
            "",
            message
        ].join("\n");

        const adresse = "https://wa.me/" + formulaire.dataset.numero + "?text=" + encodeURIComponent(texte);
        window.open(adresse, "_blank", "noopener");
    });
}


/* ==================================================
   13. CV, E-MAIL, RÉSEAUX ET AVIS
   Ces éléments restent cachés tant que tu n'as pas
   rempli les réglages correspondants en haut du fichier.
================================================== */
function initialiserInfos() {

    if (REGLAGES.cv) {
        $$("[data-cv]").forEach((lien) => {
            lien.setAttribute("href", REGLAGES.cv);
            lien.hidden = false;
        });
        $$("[data-cv-wrap]").forEach((bloc) => { bloc.hidden = false; });
    }

    if (REGLAGES.email) {
        $$("[data-email]").forEach((bloc) => {
            const lien = $("a", bloc);
            lien.setAttribute("href", "mailto:" + REGLAGES.email);
            lien.textContent = REGLAGES.email;
            bloc.hidden = false;
        });
    }

    if (REGLAGES.reseaux.length > 0) {
        $$("[data-reseaux]").forEach((liste) => {
            REGLAGES.reseaux.forEach((reseau) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = reseau.url;
                a.textContent = reseau.nom;
                a.target = "_blank";
                a.rel = "noopener";
                li.appendChild(a);
                liste.appendChild(li);
            });
            liste.hidden = false;
        });
    }

    const sectionAvis = $("[data-avis]");
    const listeAvis = $("[data-avis-list]");
    if (sectionAvis && listeAvis && REGLAGES.avis.length > 0) {
        REGLAGES.avis.forEach((avis) => {
            const li = document.createElement("li");
            li.className = "card avis";
            li.setAttribute("data-spot", "");

            const citation = document.createElement("blockquote");
            citation.textContent = avis.texte;

            const auteur = document.createElement("p");
            auteur.className = "avis-auteur";
            auteur.textContent = avis.nom;

            if (avis.role) {
                const role = document.createElement("span");
                role.className = "avis-role";
                role.textContent = avis.role;
                auteur.appendChild(role);
            }

            li.append(citation, auteur);
            listeAvis.appendChild(li);
        });
        sectionAvis.hidden = false;
    }
}


/* ==================================================
   DÉMARRAGE
================================================== */

// Les apparitions démarrent tout de suite (le script est en bas de page)
initialiserApparitions();

document.addEventListener("DOMContentLoaded", () => {
    initialiserMenu();
    initialiserDefilement();
    initialiserRetourHaut();
    initialiserPageActive();
    initialiserBarres();
    initialiserCompteurs();
    initialiserInfos();
    initialiserProjecteur();
    initialiserBande();
    initialiserWhatsApp();
    initialiserAnnee();
    initialiserFiltres();
    initialiserFormulaire();
});
