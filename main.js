document.addEventListener('DOMContentLoaded', () => {
    // --- AOS Initialization ---
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true, // whether animation should happen only once - while scrolling down
    });

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('header nav');

    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
        navToggle.classList.toggle('nav-open'); // For hamburger animation
    });

    // Close mobile nav when a link is clicked
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                navToggle.classList.remove('nav-open');
            }
        });
    });
    
    // --- Smooth scrolling for anchor links (alternative to CSS scroll-behavior for wider browser support if needed) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) { // Check if it's a valid selector and not just "#"
                e.preventDefault();
                document.querySelector(hrefAttribute).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Three.js Simple Animation ---
    const threeContainer = document.getElementById('threejs-container');
    if (threeContainer) {
        let scene, camera, renderer, object;

        function initThreeJS() {
            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            // Renderer
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha: true for transparent background
            renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
            threeContainer.appendChild(renderer.domElement);

            // Simple Object (e.g., a Torus Knot or a textured sphere if you have an image)
            // For a more "devotional" feel, you might want to load a simple GLTF model of a diya or Om symbol
            // This is a placeholder TorusKnot:
            const geometry = new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16);
            const material = new THREE.MeshStandardMaterial({ 
                color: 0xFFD700, // Gold
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0x442200, // A bit of warm glow
            }); 
            object = new THREE.Mesh(geometry, material);
            scene.add(object);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffe0b2, 0.5); // Warm light
            directionalLight.position.set(-5, 3, 5);
            scene.add(directionalLight);


            // Handle window resize
            window.addEventListener('resize', onWindowResize, false);

            animate();
        }

        function onWindowResize() {
            if (camera && renderer && threeContainer) {
                camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            if (object) {
                object.rotation.x += 0.003;
                object.rotation.y += 0.005;
            }
            renderer.render(scene, camera);
        }

        initThreeJS();
    }

});