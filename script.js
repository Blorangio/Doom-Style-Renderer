let mainCanvas = document.getElementById("mainCanvas");

//To center the canvas (known width and height are 1600 and 900 respectively)
mainCanvas.style.marginLeft = (window.innerWidth - 1600) / 2 + "px";
mainCanvas.style.marginTop = (window.innerHeight - 900) / 2 + "px";

//Define graphics component
let paint = mainCanvas.getContext("2d");

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector3D extends Vector2D {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }
}

//Finds a 2D polygon given a set of 3D points and the direction to project them
function definePolygon2D(shape3D, direction) {
    //Given the scope of the project only requires two types of projections, direction will either be a 1 or a 0
    let points2D = convertPoints2D(shape3D.points, direction);
    points2D = removeCopies(points2D);

    let averagePoint = new Vector2D(0, 0);

    for(let i = 0;i<points2D.length;i++) {
        averagePoint.x += points2D[i].x;
        averagePoint.y += points2D[i].y;
    }

    averagePoint.x /= points2D.length;
    averagePoint.y /= points2D.length;

    let farthestPoint = 0;
    let distance = getDistance2D(points2D[farthestPoint], averagePoint);
    
    for(let i = 1;i<points2D.length;i++) {
        let newDistance = getDistance2D(points2D[i], averagePoint);

        if(distance < newDistance) {
            farthestPoint = i;
            distance = newDistance;
        }
    }

    let listOuterPoints = [farthestPoint];
    let currentPoint = 0;

    while(true) {
        let endRound = true;

        for(let i = 0;i<points2D.length;i++) {
            if(i==listOuterPoints[currentPoint]) {continue}

            for(let j = 0;j<points2D.length;j++) {
                if(j==listOuterPoints[currentPoint] || j==i){continue}
                let measure = calculateAngle(listOuterPoints[currentPoint], points2D[i], points2D[j]);
                let tester = new Vector2D(points2D[i].x - listOuterPoints[currentPoint].x, points2D[i].y - listOuterPoints[currentPoint].y);

                if(tester.x <= 0 && tester.y > 0 || tester.x < 0) {
                    measure = 360 - measure;
                }

                if(measure <= 180) {break}

                endRound = false;

                if(j == points2D.length - 1) {
                    listOuterPoints.push(i);
                    currentPoint++;
                }
            }
        }
        
        if(endRound) {break}
    }

    return listOuterPoints;
}

function convertPoints2D(points3D, direction) {
    let newPoints = [];
    if(direction == 0) {
        for(let i = 0;i<points3D.length;i++) {
            newPoints.push(new Vector2D(points3D[i].x, points3D[i].y));
        }
    } else {
        for(let i = 0;i<points3D.length;i++) {
            newPoints.push(new Vector2D(points3D[i].x, points3D[i].z));
        }
    }
    return newPoints;
}

function getDistance2D(point1, point2) {
    let x = point1.x - point2.x;
    let y = point1.y - point2.y;
    return Math.sqrt(x * x + y * y);
}

function removeCopies(pointList) {
    let newPointList = [];
    for(let i = 0;i<pointList.length;i++) {
        if(!contains(newPointList, pointList[i])) {
            newPointList.push(pointList[i]);
        }
    }
    return newPointList;
}

function contains(pointList, item) {
    for(let i = 0;i<pointList.length;i++) {
        if(pointList[i] == item) {
            return true;
        }
    }
    return false;
}

function calculateAngle(point1, point2, point3) {
    let a = getDistance2D(point1, point2);
    let b = getDistance2D(point2, point3);
    let c = getDistance2D(point1, point3);

    let angle = Math.acos((a*a + b*b - c*c) / (2 * a * b));
    
    return angle;
}