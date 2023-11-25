document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('interactiveCanvas');
    const ctx = canvas.getContext('2d');

    function updateCanvasSizeAndPosition() {
        if ('getScreenDetails' in window) {
            window.getScreenDetails().then(screenDetails => {
                const currentScreen = screenDetails.currentScreen;

                // Set canvas size to the size of the monitor
                canvas.width = currentScreen.width;
                canvas.height = currentScreen.height;

                // Adjust canvas position based on the window's position
                canvas.style.left = (-window.screenX) + 'px';
                canvas.style.top = (-window.screenY) + 'px';

                drawElements(); // Redraw elements after repositioning
            }).catch(error => {
                console.error('Error fetching screen details:', error);
            });
        } else {
            console.error('getScreenDetails API is not available in this browser.');
        }
    }

    function drawElements() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Get the center of the canvas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
    
        // Define properties of the orb
        const numParticles = 750; // Number of particles in the orb
        const orbRadius = 300; // Base radius of the orb
        const particleRadius = 2; // Radius of each particle
    
        // Define properties of the dust
        const numDustParticles = 1000; // Number of dust particles
        const dustMaxDistance = 150; // Maximum distance dust particles can be from the orb
        const dustParticleRadius = .75; // Radius of each dust particle
    
        // Get the current time for dynamic movement
        const now = new Date();
        const time = now.getTime();
    
        // Create a pulsating effect for the orb
        const pulsate = Math.sin(time * 0.001) * 10; // Slower pulsation
    
        // Angle for 3D rotation around the y-axis
        const rotationAngle = time * 0.0002; // Slower rotation
    
        // Draw each particle in the orb
        for (let i = 0; i < numParticles; i++) {
            // Distribute particles in a spherical pattern
            const phi = Math.acos(-1 + (2 * i) / numParticles);
            const theta = Math.sqrt(numParticles * Math.PI) * phi;
    
            // 3D Rotation on the y-axis
            const cosAngle = Math.cos(rotationAngle);
            const sinAngle = Math.sin(rotationAngle);
    
            let x = (orbRadius + pulsate) * Math.sin(phi) * Math.cos(theta);
            const y = (orbRadius + pulsate) * Math.sin(phi) * Math.sin(theta);
            let z = (orbRadius + pulsate) * Math.cos(phi);
    
            // Apply rotation
            const tempX = x;
            x = x * cosAngle - z * sinAngle;
            z = z * cosAngle + tempX * sinAngle;
    
            // Draw the particle
            ctx.fillStyle = `hsla(${360 * i / numParticles}, 100%, 50%, 0.7)`;
            ctx.beginPath();
            ctx.arc(x + centerX, y + centerY, particleRadius, 0, Math.PI * 2, true);
            ctx.fill();
        }
    
        // Draw dust particles
        for (let i = 0; i < numDustParticles; i++) {
            // Wave-like, slower synchronized positions for dust particles
            const angle = (i / numDustParticles) * Math.PI * 2 + (time * 0.0001);
            const distance = orbRadius + pulsate + (Math.sin(time * 0.001 + i) * dustMaxDistance);
    
            const dustX = centerX + distance * Math.cos(angle);
            const dustY = centerY + distance * Math.sin(angle);
    
            // Draw the dust particle
            ctx.fillStyle = `rgba(255, 255, 255, 0.5)`; // Dust particles are lighter and more transparent
            ctx.beginPath();
            ctx.arc(dustX, dustY, dustParticleRadius, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
    
    // Update the drawElements function in the setInterval to redraw continuously
    setInterval(drawElements, 50);      

    // Update the canvas size and position continuously
    setInterval(updateCanvasSizeAndPosition, 100);

    // Initial setup
    updateCanvasSizeAndPosition();
});

