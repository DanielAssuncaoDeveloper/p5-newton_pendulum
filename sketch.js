const circles = []
let lastCircles = []

let testCircle = {}
let alterarCirculo = false

let acelerationLast = 0

let radius = 200; // raio/área que o círculo irá respeitar para se movimentar
let diameter = 50; // diametro do cículo

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angle = PI/2; // atribuindo valor ao angle

  for (let i = 0; i < 5; i++)
    circles[i] = {
      name: `circle ${i+1}`,
      angle: PI/2,
      initX: i * 51,
      initY: 0,
      direction: 1,
      selected: false,
      angularVelocity: 0,
      aceleration: 0
    }
}

function draw() {
  translate(width/2, height/2 - 80); // transformando o centro do canvas no eixo central para todas as formas

  background(220);
  
  for (let i = 0; i < 5; i++)
    createCircle(circles[i], i)

  if (alterarCirculo)
    circles[0] = testCircle
    

  alterarCirculo = false
}

function createCircle(circleObject, index){
  let xVar = getCartesianCoordinateX(circleObject) // coordenada x cartesiana
  let yVar = getCartesianCoordinateY(circleObject) // coordenada y cartesiana
  
  if(mouseIsPressed && mouseInCircle(circleObject)){
    circleObject.selected = true;
    
    // operador tenário que verificará se o ajuste do mouseX é maior que 0 (centro do canvas), caso verdadeiro, a variável da direção se torna 1, caso contrário, se torna -1
    circleObject.direction = (getMouseX() > circleObject.initX) ? 1 : -1;

  } else if (!mouseIsPressed && circleObject.selected) {
    circleObject.selected = false;

    // define a velociade angular para 0.1, que mais a frente será somada com o angulo e depois redefinida a 0 para parar o movimento do círculo
    // circleObject.angularVelocity = 0.01;
    circleObject.aceleration = (0.02 * circleObject.direction)
  }
  
  if(circleObject.selected ){
    // cria uma nova variável para salvar temporáriamente a posição do novo angulo, que será dado pelo mouse em relação ao círculo
    let newAngle = atan2(getMouseY() - circleObject.initY, getMouseX() - circleObject.initX)
    
    // aqui delimita o movimento para até 90° cada lado, logo após atribui o valor novo ao ângulo
    if(newAngle >= 0 && newAngle <= PI){
      circleObject.angle = newAngle;
    }
    
  }else{
    // nessa parte o angulo receberá qual a direção deve ir para voltar ao centro e a velocidade angular, que irá aumentando constantemente
    circleObject.angularVelocity += circleObject.aceleration;
    circleObject.angle += circleObject.angularVelocity;
    
    if((circleObject.direction == 1 && circleObject.angle > PI/2 && circleObject.angularVelocity > 0) || (circleObject.direction == -1 && circleObject.angle < PI/2  && circleObject.angularVelocity < 0)){
      let nextCircle 
      if (circleObject.direction == 1)
        nextCircle = circles.find(element => element.angularVelocity == 0)
      else
        nextCircle = circles.findLast(element => element.angularVelocity == 0)
      
      let tempCircle = {...circleObject}
      
      circles[index].direction = 1
      circles[index].aceleration = 0
      circles[index].angularVelocity = 0
      circles[index].angle = PI/2
      
      // nextCircle.angle = circleObject.angle
      nextCircle.direction = tempCircle.direction * -1
      nextCircle.aceleration = tempCircle.aceleration * -1
      nextCircle.angularVelocity = tempCircle.angularVelocity * 0.95

      if (index == 0){
        testCircle = {...(circles[index])}
        alterarCirculo = true
      }
      
    }
  }

  // desenha a linha e cículo, sem necessidade de comentário aqui né
  line(circleObject.initX, circleObject.initY, xVar, yVar);
  circle(xVar, yVar, diameter);
}


function setCirclesToDefault(index){
  if (circles[index].angularVelocity != 0 && lastCircles[index].angularVelocity != 0){
    console.log(1)
    circles.forEach(x => {x.aceleration = 0; x.angularVelocity = 0})
  }
}

function getCartesianCoordinateX(circleObject){
  return circleObject.initX + radius * cos(circleObject.angle);
}

function getCartesianCoordinateY(circleObject){
  return circleObject.initY + radius * sin(circleObject.angle);
}

function mouseInCircle(circleObject){
  return dist(getMouseX(), getMouseY(), circleObject.initX, circleObject.initY + radius) <= diameter/2
}

function getMouseX(){
  return mouseX - width/2;
}

function getMouseY(){
  return mouseY - (height/2 - 80);
}