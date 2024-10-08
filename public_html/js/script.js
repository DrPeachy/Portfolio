$(document).ready(function () {
  // gsap.registerPlugin(ScrollTrigger);

  // Function to set up ScrollTrigger for each section
  // function setupScrollTriggers() {
  //   $('.section').each(function(index, section) {
  //     const triggerElement = section;
  //     const pinElement = section;

  //     ScrollTrigger.create({
  //       trigger: triggerElement,
  //       pin: pinElement,
  //       start: 'top 56',
  //       end: '+=90%',
  //       pinSpacing: false,
  //       pin: true,
  //       scrub: 1,
  //       markers: true // Remove or set to false when done debugging
  //     });
  //   });
  // }

  // Function to hide the loading overlay
  // function hideLoadingOverlay() {
  //   gsap.to("#loading-overlay", {
  //     duration: 1,
  //     opacity: 0,
  //     onComplete: function() {
  //       $("#loading-overlay").remove();
  //       $("body, html").css("overflow", "auto");
  //     }
  //   });
  // }

  // Load DOM
  detectAndLoad();
  loadFooter();
  cursorControl();
  // setupScrollTriggers();

  // Set children under main to invisible
  $("main").children().css({
    opacity: "0",
  });

  fadeInOnScroll();

  // On scroll, apply the fade-in effect
  $(window).scroll(function () {
    fadeInOnScroll();
    styleNavbarOnScroll();
  });

  function styleNavbarOnScroll() {
    const scrollPosition = $(window).scrollTop();
    const navbar = $("#navbar-section .navbar");

    if (scrollPosition > 80) {
      // Page is scrolled down - style for dark navbar
      navbar.css({
        "background-color": "black", // or any dark color you prefer
        color: "white",
      });
      navbar.find(".nav-link").css("color", "white"); // Change link color
      navbar.find(".navbar-brand").css("color", "white"); // Change brand color
      navbar.find(".navbar-toggler").css("color", "white"); // Change toggler color
    } else {
      // At the top - style for light navbar
      navbar.css({
        "background-color": "white",
        color: "black",
      });
      navbar.find(".nav-link").css("color", "grey"); // Change link color
      navbar.find(".navbar-brand").css("color", "black"); // Change brand color
      navbar.find(".navbar-toggler").css("color", "black"); // Change toggler color
    }
  }

  function fadeInOnScroll() {
    const windowHeight = $(window).height();
    const windowTopPosition = $(window).scrollTop();
    const windowBottomPosition = windowTopPosition + windowHeight;

    $("main")
      .children()
      .each(function () {
        const element = $(this);
        const elementHeight = element.outerHeight();
        const elementTopPosition = element.offset().top;
        const elementBottomPosition = elementTopPosition + elementHeight;
        const alementLeftPosition = element.offset().left;
        const elementRightPosition = alementLeftPosition + element.outerWidth();

        // Check if the element is within the viewport
        if (
          elementBottomPosition >= windowTopPosition &&
          elementTopPosition <= windowBottomPosition &&
          elementRightPosition >= 0 &&
          alementLeftPosition <= window.innerWidth
        ) {
          element.css("opacity", "1");
          element.css("transition", "opacity 1s ease-in-out");
        } else {
          element.css("opacity", "0");
          element.css("transition", "opacity 1s ease-in-out");
        }
      });
  }

  function detectAndLoad() {
    let path = window.location.pathname;
    let page = path.split("/").pop();
    if ($("#cursor").length === 0) {
      loadCursor();
    }

    if (page === "index.html" || page === "") {
      loadNavbar(0);
    } else {
      loadNavbar(1);
    }
    if (page === "model.html") {
      loadModel();
    }
    if (page === "game.html") {
      loadGame();
    }
  }

  // Hide loading overlay after everything is loaded
  // $(window).on('load', function () {
  //   if (!sessionStorage.getItem('pageLoaded')) {
  //     sessionStorage.setItem('pageLoaded', 'true');
  //     hideLoadingOverlay();
  //   } else {
  //     $("#loading-overlay").remove();
  //   }
  // });
  

  // cursor
  function loadCursor() {
    $("body").append(`
      <div id="cursor" class="cursor">
        <svg viewBox="140 140 120 120" xmlns="http://www.w3.org/2000/svg">
          <ellipse id="cursor-ellipse" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); fill-opacity: 0.57; stroke-width: 8px;" cx="200" cy="200" rx="53.219" ry="53.219"/>
          <line id="cursor-line1" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-width: 8px;" x1="200" y1="195.739" x2="200" y2="204.261"/>
          <line id="cursor-line2" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-width: 8px;" x1="204.261" y1="200" x2="195.739" y2="200"/>
        </svg>
      </div>
    `);
  }
  // navbar
  function loadNavbar(type = 0) {
    const fadeInNavItem = () => {
      $(".navbar-nav").children().hide();
      $(".navbar-nav")
        .children()
        .each(function (i) {
          $(this)
            .delay(200 * i)
            .fadeIn(500);
        });
    };
    let navbarIndex = `
      <div class="col-md-12 px-0 mx-0" id="navbar-section">
        <nav class="navbar navbar-expand-lg navbar-light px-5"
          style="background-color: #fff;"
        >
          <a class="navbar-brand" href="index.html">Charles' Realm</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="bi bi-chevron-double-down"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav"
          >
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="game.html">Games</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="model.html">3D Modeling</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="resume.html">Resume</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>`;

    let navbarOther = `
    <div class="col-md-12 px-0 mx-0" id="navbar-section">
      <nav class="navbar navbar-expand-lg navbar-light px-5"
        style="background-color: #fff;"
      >
        <a class="navbar-brand" href="index.html">Charles' Realm</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="bi bi-chevron-double-down"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="index.html">&lt;&lt;&lt;back</a>
            </li>

          </ul>
        </div>
      </nav>
    </div>`;
    if (type == 0) {
      $("#wrap header").html(navbarIndex);
    } else {
      $("#wrap header").html(navbarOther);
    }
    fadeInNavItem();
  }
  // game
  function loadGame() {
    const imageFilenameMap = {
      morph: "https://1067838263.itch.io/morph",
      planet: "https://1067838263.itch.io/planet",
      knight: "https://bluetitanium.itch.io/knight-and-spear",
      tetris: "https://1067838263.itch.io/tetrisrush",
      seagull: "https://pyc23.itch.io/seagull-express",
    };

    const keyToTitle = {
      morph: "Morph",
      planet: "Procedural Planet",
      knight: "Knight and Spear",
      tetris: "Tetris Rush",
      seagull: "Seagull Express",
    };

    const keyToDescription = {
      morph:
        "Morph is a 2D platformer puzzle game I made in a team of 5 with Unity. I was responsible for implementing the core gameplay functionality and game framework, level designing, creating 2D assets with Aseprite, and implementing visual effects.",
      planet:
        "Planet is a game(more like a toy) that I made with Unity. I created high poly spherical mesh from scretch, and utilized Perlin noise and Voronoi to create shader and generate a spherical planet with fascinating looking.",
      knight:
        "Knight and Spear is a 2D rogue-like game I made in a team of 3 with Unity. I was responsible for the game loop logic implementation.",
      tetris:
        "Tetris Rush is a 2D puzzle game I made with a friend with Unity. It is made for game jam, SpaceScore#19, which I integrated a leaderboard for recording scores from random players.",
      seagull:
        "Seagull Express is a 2D topdown Android game I made in a team of 4 with Unity. I was responsible for implementing the core game logic, and creating some of the 2D assets.",
    };

    const imageTags = Object.entries(imageFilenameMap).map(
      ([keyword, link]) => {
        let tags = "";
        tags += `<div class="section row flex-column justify-content-center col-md-11 px-0" style="height: auto" id="game-${keyword}">`;
        tags += ` <h2 class="text-center sub-header">${keyToTitle[keyword]}</h2>`;
        tags += ` <div class="row flex-row justify-content-center">`;
        tags += `   <img class="col-md-4" src="img/games/${keyword}.jpg" alt="${keyword}">`;
        tags += `   <div class="col-md-5">`;
        tags += `     <p class="lead text-left" style="font-size: calc(1em + 1vw)">${keyToDescription[keyword]}</p>`;
        tags += `     <div><a href="${link}" target="_blank" class="btn btn-outline-dark">Play</a></div>`;
        tags += `   </div>`;
        tags += ` </div>`;
        tags += `</div>`;
        return tags;
      }
    );

    $("#game-section").html(imageTags);
  }
  // model
  function loadModel() {
    const imageFilenameMap = {
      Chocobo_Alpha: 4,
      Eva_02: 4,
      Kuromi: 3,
      restaurant: 3,
    };
    const keyToTitle = {
      Chocobo_Alpha: "Chocobo Alpha",
      Eva_02: "Eva 02",
      Kuromi: "Kuromi on Saturn",
      restaurant: "Restaurant",
    };
    const keyToDescription = {
      Chocobo_Alpha:
        "Chocobo Alpha is a character from Final Fantasy. This is a model made with Zbrush and Maya.",
      Eva_02:
        "Eva 02 is a character from Neon Genesis Evangelion. This is a model made with Maya and Substance Painter.",
      Kuromi:
        "Kuromi is a character from Sanrio. This is a model made with Zbrush and Maya.",
      restaurant: "This is a low-poly model I made with Maya.",
    };

    const imageTags = Object.entries(imageFilenameMap).map(
      ([keyword, number]) => {
        let tags = "";
        tags += `<div class="row flex-column justify-content-center col-md-11 px-0" id="model-${keyword}">`;
        tags += ` <h2 class="text-center sub-header">${keyToTitle[keyword]}</h2>`;
        tags += ` <p class="lead text-center" style="font-size: calc(1em + 1vw)">${keyToDescription[keyword]}</p>`;
        for (let i = 1; i <= number; i++) {
          tags += ` <img class="section" style="height: auto; width: auto; object-fit: contain;" src="img/models/${keyword}_${i}.jpg" alt="${keyword} ${i}">`;
        }
        tags += `</div>`;
        return tags;
      }
    );
    $("#model-section").html(imageTags);
  }

  // footer
  function loadFooter() {
    let footer = `
    <div class="row flex-row justify-content-center align-items-end col-md-12 px-0" id="footer-icon">
      <a href="https://github.com/DrPeachy" target="_blank" style="font-size: 40px; color: #000; width: auto;">
        <i class="bi bi-github"></i>
      </a>
      <a href="https://steamcommunity.com/id/1067838263/" target="_blank" style="font-size: 40px; color: #000; width: auto;">
        <i class="bi bi-steam"></i>
      </a>
      <a href="https://www.linkedin.com/in/p1067838263" target="_blank" style="font-size: 40px; color: #000; width: auto">
        <i class="bi bi-linkedin"></i>
      </a>
      <a class="p-0" href="https://1067838263.itch.io/" target="_blank" style="font-size: 40px; color: #000; width: 64px">
        <img class="p-0" src="img/icons/itch-io.svg" href="https://1067838263.itch.io/" alt="itch.io" style="height: 64px;">
      </a>

    </div>
    <div class="col-md-12 px-0" id="footer-copyright">
      <p class="lead text-center">
        © 2023 Cheng Pan. All rights reserved.
      </p>
    </div>`;
    $("#wrap footer").html(footer);
  }

  //==========cursor===========
  function cursorControl(lineChange = 20) {
    $(document).mousemove(function (e) {
      const cursor = $("#cursor");
      const pageX = e.clientX;
      const pageY = e.clientY;
      cursor.css({
        left: pageX + "px",
        top: pageY + "px",
      });
    });

    $("button, a").hover(
      // Mouse in
      function () {
        $("#cursor").css({
          "transform": "scale(2.2) translate(-50%, -50%)",
          "transform-origin": "left top",
          "transition": "transform 0.2s ease-in-out",
        });

        $("#cursor #cursor-ellipse, #cursor-line1, #cursor-line2").css({
          "stroke-width": "3px",
          "transition": "stroke-width 0.2s ease-in-out",
        });

        gsap.to("#cursor-ellipse", {
          duration: 0.2,
          fill: "rgb(55, 152, 255)",
          ease: "power2.out",
        });

        gsap.to("#cursor-line1", {
          duration: 0.2,
          attr: {
            y1: 195.739 - lineChange,
            y2: 204.261 + lineChange,
          },
          ease: "power2.out",
        });

        gsap.to("#cursor-line2", {
          duration: 0.2,
          attr: {
            x1: 204.261 + lineChange,
            x2: 195.739 - lineChange,
          },
          ease: "power2.out",
        });
        $(this).css("cursor", "none");
      },
      // Mouse out
      function () {
        $("#cursor").css({
          "transform": "scale(1) translate(-50%, -50%)",
          "transform-origin": "left top",
          "transition": "transform 0.2s ease-in-out",
        });
        $("#cursor #cursor-ellipse, #cursor-line1, #cursor-line2").css({
          "stroke-width": "8px",
          "transition": "stroke-width 0.2s ease-in-out",
        });

        gsap.to("#cursor-ellipse", {
          duration: 0.2,
          fill: "rgb(216, 216, 216)",
          ease: "power2.out",
        });

        gsap.to("#cursor-line1", {
          duration: 0.2,
          attr: {
            y1: 195.739,
            y2: 204.261,
          },
          ease: "power2.out",
        });

        gsap.to("#cursor-line2", {
          duration: 0.2,
          attr: {
            x1: 204.261,
            x2: 195.739,
          },
          ease: "power2.out",
        });
        $(this).css("cursor", "none");
      }
    );
    $("button, a").on("mousedown", function () {
      $("#cursor").css("transform", "scale(1.8) translate(-50%, -50%)");
      $("#cursor").css("transform-origin", "left top");

      $("#cursor").css("transition", "transform 0.2s ease-in-out");
      $(this).css("cursor", "none");
    });
  }
});
