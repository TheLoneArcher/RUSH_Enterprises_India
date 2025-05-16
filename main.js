document.addEventListener('DOMContentLoaded', () => {
    // --- AOS Initialization ---
    AOS.init({
        duration: 700, // Slightly faster
        offset: 50,    // Trigger a bit earlier
        once: true,
    });

    // --- Mobile Navigation Toggle ---
    const header = document.querySelector('header'); // Select header
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('header nav');

    navToggle.addEventListener('click', () => {
        header.classList.toggle('nav-open'); // Toggle on header
    });

    // Close mobile nav when a link is clicked
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (header.classList.contains('nav-open')) {
                header.classList.remove('nav-open');
            }
        });
    });
    
    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) {
                e.preventDefault();
                document.querySelector(hrefAttribute).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Three.js Particle System ---
    const threeContainer = document.getElementById('threejs-container');
    if (threeContainer) {
        let scene, camera, renderer, particles;
        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        function initThreeJS() {
            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 1, 2000);
            camera.position.z = 700; // Zoom out a bit for particles

            // Renderer
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for pixel density
            threeContainer.appendChild(renderer.domElement);

            // Particles
            const particleCount = 5000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3); // For varied particle colors

            const color1 = new THREE.Color(0x64FFDA); // Cyan accent
            const color2 = new THREE.Color(0xFF4081); // Pink accent
            const baseColor = new THREE.Color(0xCCD6F6); // Base text color

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 2000; // x
                positions[i3 + 1] = (Math.random() - 0.5) * 2000; // y
                positions[i3 + 2] = (Math.random() - 0.5) * 2000; // z

                // Assign colors - mix of accents and base
                const randomChoice = Math.random();
                let chosenColor;
                if (randomChoice < 0.1) {
                    chosenColor = color1;
                } else if (randomChoice < 0.2) {
                    chosenColor = color2;
                } else {
                    chosenColor = baseColor.clone().lerp(new THREE.Color(0x0A192F), Math.random() * 0.5); // Lerp with bg for depth
                }
                colors[i3] = chosenColor.r;
                colors[i3 + 1] = chosenColor.g;
                colors[i3 + 2] = chosenColor.b;
            }

            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


            const particleMaterial = new THREE.PointsMaterial({
                size: 2.5,
                vertexColors: true, // Use colors from geometry
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending, // Brighter where particles overlap
                depthWrite: false // Avoid particles occluding each other strangely
            });

            particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);
            
            // Mouse move listener
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.body.addEventListener('mouseout', onDocumentMouseOut, false); // Reset when mouse leaves

            // Handle window resize
            window.addEventListener('resize', onWindowResize, false);

            animate();
        }
        
        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) / 3; // Divide to reduce sensitivity
            mouseY = (event.clientY - windowHalfY) / 3;
        }

        function onDocumentMouseOut() { // Gently reset camera when mouse leaves window
            mouseX = 0;
            mouseY = 0;
        }


        function onWindowResize() {
            if (camera && renderer && threeContainer) {
                camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.00005; // Slower overall animation speed

            // Camera movement based on mouse
            camera.position.x += (mouseX - camera.position.x) * 0.02;
            camera.position.y += (-mouseY - camera.position.y) * 0.02; // Invert mouseY
            camera.lookAt(scene.position);

            // Animate particles (subtle fluid motion)
            if (particles) {
                const positions = particles.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    // Subtle wave-like motion
                    positions[i + 1] += Math.sin(time * 50 + positions[i] * 0.01) * 0.1; // Y position
                    positions[i] += Math.cos(time * 30 + positions[i+1] * 0.01) * 0.08; // X position
                }
                particles.geometry.attributes.position.needsUpdate = true;
                particles.rotation.y = time * 0.2; // Slow rotation of the entire particle system
            }

            renderer.render(scene, camera);
        }

        initThreeJS();
    }
});