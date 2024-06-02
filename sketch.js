let circles = []

let radius = 200; // raio/área que o círculo irá respeitar para se movimentar
let diameter = 50; // diametro do cículo

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angle = PI/2; // atribuindo valor ao angle

  for (let i = 0; i < 2; i++)
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

  circles.forEach((element) => {
    createCircle(element)
  });

}

function createCircle(circleObject){
  let xVar = circleObject.initX + radius * cos(circleObject.angle); // coordenada x cartesiana
  let yVar = circleObject.initY + radius * sin(circleObject.angle); // coordenada y cartesiana
  
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
    
    console.log(((circleObject.direction == 1 && circleObject.angle >= PI/2) || (circleObject.direction == -1 && circleObject.angle <= PI/2)), circleObject.name)

    if(((circleObject.direction == 1 && circleObject.angle >= PI/2 && circleObject.angularVelocity > 0) || (circleObject.direction == -1 && circleObject.angle <= PI/2  && circleObject.angularVelocity < 0))){
      let nextCircle 
      if (circleObject.direction == 1)
        nextCircle = circles[0] 
      else
        nextCircle = circles[1]

        circleObject.angle = PI/2
      circleObject.angularVelocity * 0.95
      
      nextCircle.angle = circleObject.angle
      nextCircle.direction = circleObject.direction * -1
      nextCircle.aceleration = circleObject.aceleration * -1
      nextCircle.angularVelocity = circleObject.angularVelocity * 0.95

      circleObject.aceleration = 0
      circleObject.angularVelocity = 0
    }
  }

  // desenha a linha e cículo, sem necessidade de comentário aqui né
  line(circleObject.initX, circleObject.initY, xVar, yVar);
  circle(xVar, yVar, diameter);
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