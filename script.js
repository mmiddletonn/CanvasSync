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
                centerCanvasOnWindow();
            });
        } else {
            console.error('getScreenDetails API is not available in this browser.');
            centerCanvasOnWindow();
        }
    }

    function centerCanvasOnWindow() {
        // Set canvas size to the size of the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Center the canvas on the window
        canvas.style.left = '0';
        canvas.style.top = '0';

        drawElements(); // Redraw elements after repositioning
    }

    function drawElements() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Define properties of the orb
        const numParticles = 1500; // Number of particles in the orb
        const orbRadius = 200; // Base radius of the orb
        const particleRadius = 1; // Radius of each particle
    
        // Define properties of the dust
        const numDustParticles = 5000; // Number of dust particles
        const dustMaxDistance = 150; // Maximum distance dust particles can be from the orb
        const dustParticleRadius = .55; // Radius of each dust particle
        const numBands = 5; // Number of mist bands
    
        // Speed range for dust particles (modifiable)
        const minSpeed = 0.0000005; // Minimum speed for dust particles
        const maxSpeed = 0.000002; // Maximum speed for dust particles
    
        // Get the current time for dynamic movement
        const now = new Date();
        const time = now.getTime();
    
        // Bulging speed effect for dust particles
        const speedVariation = Math.sin(time * 0.0001) * (maxSpeed - minSpeed) / 2;
        const currentSpeed = minSpeed + speedVariation;
    
        // Create a pulsating effect for the orb (constant speed)
        const pulsate = Math.sin(time * 0.001) * 10;
    
        // Angle for 3D rotation around the y-axis (constant speed)
        const rotationAngle = time * 0.0002;
    
        // Draw each particle in the orb
        for (let i = 0; i < numParticles; i++) {
            const phi = Math.acos(-1 + (2 * i) / numParticles);
            const theta = Math.sqrt(numParticles * Math.PI) * phi;
    
            const cosAngle = Math.cos(rotationAngle);
            const sinAngle = Math.sin(rotationAngle);
    
            let x = (orbRadius + pulsate) * Math.sin(phi) * Math.cos(theta);
            const y = (orbRadius + pulsate) * Math.sin(phi) * Math.sin(theta);
            let z = (orbRadius + pulsate) * Math.cos(phi);
    
            const tempX = x;
            x = x * cosAngle - z * sinAngle;
            z = z * cosAngle + tempX * sinAngle;
    
            ctx.fillStyle = `hsla(${360 * i / numParticles}, 100%, 50%, 0.7)`;
            ctx.beginPath();
            ctx.arc(x + orbX, y + orbY, particleRadius, 0, Math.PI * 2, true);
            ctx.fill();
        }
    
        // Draw dust particles in scattered bands with variable speed
        for (let i = 0; i < numDustParticles; i++) {
            const band = Math.floor(i / (numDustParticles / numBands));
            const bandPosition = (i % (numDustParticles / numBands)) / (numDustParticles / numBands);
            const angleOffset = bandPosition * 2 * Math.PI;
    
            const distanceVariation = Math.sin(bandPosition * 2 * Math.PI) * dustMaxDistance / 2;
            const randomScatter = Math.random() * dustMaxDistance - dustMaxDistance / 2;
            const distance = orbRadius + pulsate + distanceVariation + randomScatter + (band * dustMaxDistance / numBands);
    
            const angle = (band / numBands) * Math.PI * 2 + angleOffset + time * currentSpeed;
    
            const dustX = orbX + distance * Math.cos(angle);
            const dustY = orbY + distance * Math.sin(angle);
    
            ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
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
