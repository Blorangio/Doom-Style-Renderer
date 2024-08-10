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

class Shape3D {
    constructor(points) {
        this.points = points;
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

    for(let i = 0;i<listOuterPoints.length;i++) {
        let checkPoint = new Vector2D(2 * points2D[listOuterPoints[i]].x - averagePoint.x, 2 * points2D[listOuterPoints[i]].y - averagePoint.y);

        let smallestAngle = 360;
        let smallestAnglePoint = listOuterPoints[i];
        
        for(let j = 0;j<points2D.length;j++) {
            if(j==listOuterPoints[i]) {continue}

            let measure = calculateAngle(checkPoint, points2D[listOuterPoints[i]], points2D[j]);
            let checkLine = new Vector2D(points2D[listOuterPoints[i]].x - checkPoint.x, points2D[listOuterPoints[i]].y - checkPoint.y);
            let finalCheckPoint = new Vector2D(points2D[j].x - checkPoint.x, points2D[j].y - checkPoint.y);

            let crossProduct = checkLine.x * finalCheckPoint.y - checkLine.y * finalCheckPoint.x;
            if(crossProduct>0) {
                measure = 360 - measure;
            }

            if(smallestAngle>measure) {
                smallestAngle = measure;
                smallestAnglePoint = j;
            }
        }

        if(!regularContains(listOuterPoints, smallestAnglePoint)) {
            listOuterPoints.push(smallestAnglePoint);
        }
    }

    let returnPoints = [];
    
    for(let i = 0;i<listOuterPoints.length;i++) {
        returnPoints.push(points2D[listOuterPoints[i]]);
    }

    return returnPoints;
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
        if(pointList[i].x == item.x && pointList[i].y == item.y) {
            return true;
        }
    }
    return false;
}

function regularContains(list, item) {
    for(let i = 0;i<list.length;i++) {
        if(list[i] == item) {
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
    
    return angle * 180 / Math.PI;
}

function pointUnderLine(point, slope, linePoint) {
    if(slope.x==0){return point.x < 0}

    return  slope.y / slope.x * (linePoint.x - point.x) < linePoint.y - point.y;
}

function genCube(x, y, z, size) {
    let points = [];
    points.push(new Vector3D(x-size/2, y-size/2, z-size/2));
    points.push(new Vector3D(x-size/2, y-size/2, z+size/2));
    points.push(new Vector3D(x-size/2, y+size/2, z+size/2));
    points.push(new Vector3D(x+size/2, y+size/2, z+size/2));
    points.push(new Vector3D(x+size/2, y+size/2, z-size/2));
    points.push(new Vector3D(x+size/2, y-size/2, z-size/2));
    points.push(new Vector3D(x-size/2, y+size/2, z-size/2));
    points.push(new Vector3D(x+size/2, y-size/2, z+size/2));
    return points;
}

let shapePoints = new Shape3D(genCube(100, 100, 100, 100));

let newPoints = definePolygon2D(shapePoints, 0);
console.log(newPoints);
