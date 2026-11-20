class Camera {
    constructor(x = 0, y = 0, z = 0, pitch = 0, yaw = 0, fov = 90) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.pitch = pitch; // up and down
        this.yaw = yaw; // left and right
        this.fov = fov;
    }

    move(distance) {
        this.x = Math.cos(this.yaw * Math.PI / 180) * distance + this.x,
        this.y = Math.sin(this.yaw * Math.PI / 180) * distance + this.y
    }

    strafe(distance) {
        this.x = Math.cos((this.yaw + 90) * Math.PI / 180) * distance + this.x,
        this.y = Math.sin((this.yaw + 90) * Math.PI / 180) * distance + this.y
    }
}

class Terrain {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.altitudeMap = new Uint8Array(width * height);
        this.colorMap = [];
    }

    loadAltitudeFromImage(image) {
        const canvas = new OffscreenCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, this.width, this.height).data;

        for (let i = 0; i < imageData.length; i += 4) {

            let indexNumber = Math.floor (i / 4); // images have r,g,b,a values, so the buffer is 4 times bigger
            this.altitudeMap[indexNumber] = imageData[i]; 
        }
    }

    loadColorFromImage(image) {
        const canvas = new OffscreenCanvas(this.width, this.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, this.width, this.height).data;

        for (let i = 0; i < imageData.length; i++) {

            let r = imageData[i]; i++;
            let g = imageData[i]; i++;
            let b = imageData[i]; i++;   

            let indexNumber = Math.floor (i / 4);
            this.colorMap[indexNumber] = `rgb(${r},${g},${b})`;
        }
    }

    getPointIndex(x, y) {
        return y * this.width + x;
    }

    setPoint(x, y, altitude, color) {
        const index = this.getPointIndex(x, y);

        if (altitude) { this.altitudeMap[index] = altitude; }
        if (color) { this.colorMap[index] = color; }
    }

    drawRays(camera = CAMERA, theatre, maxRayDepth, minRayDepth) {

        const highestYs = new Int32Array(theatre.canvas.width).fill(theatre.canvas.height);

        let rayDepthOffset = 1;

        for (let rayDepth = minRayDepth; rayDepth < maxRayDepth; rayDepth += rayDepthOffset) {

            const halfFOV = camera.fov / 2
            const leftPoint = this.getPerspectiveEdgePoint(camera.x, camera.y, camera.yaw - halfFOV, rayDepth);
            const rightPoint = this.getPerspectiveEdgePoint(camera.x, camera.y, camera.yaw + halfFOV, rayDepth);

            const rayWidth = rightPoint.x - leftPoint.x;
            const rayHeight = rightPoint.y - leftPoint.y;

            let xOffset = rayWidth / theatre.canvas.width;
            let yOffset = rayHeight / theatre.canvas.width;

            this.drawRay(leftPoint.x, leftPoint.y, xOffset, yOffset, theatre, highestYs, rayDepth, camera);

            rayDepthOffset += 0.005;
        }
    }

    drawRay(x, y, xOffset, yOffset, theatre, highestYs, rayDepth, camera) {
        
        for (let i = 0; i < theatre.canvas.width; i++) {

            if (x < 0 || x > this.width || y < 0 || y > this.height) { // don't render if off grid
                x += xOffset;
                y += yOffset;
                continue;
            }

            const pointIndex = this.getPointIndex(Math.floor(x), Math.floor(y));
            const color = this.colorMap[pointIndex];
            const altitude = this.altitudeMap[pointIndex];

            let scale = 1 / rayDepth * 150; // 300 is the vertical scaling number. 240 was use in s-macke's demo.
            let heightOnScreen = (camera.z - altitude) * scale + camera.pitch;
            heightOnScreen = Math.floor(heightOnScreen); // prevents line gaps

            if (heightOnScreen <= highestYs[i]) {
                this.drawPillar(i, heightOnScreen, highestYs[i] - heightOnScreen, color, theatre.ctx);
                highestYs[i] = heightOnScreen;
            }

            x += xOffset;
            y += yOffset;

        }

    }

    drawPillar(x, y, height, color, ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, height);
    }

    getPerspectiveEdgePoint(x, y, angle, distance) {
        return {
            x: Math.cos(angle * Math.PI / 180) * distance + x,
            y: Math.sin(angle * Math.PI / 180) * distance + y
        };
    }
}

export { Terrain, Camera };
