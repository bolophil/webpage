
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

const image1 = new Image();
var keys = document.getElementById("key");
var button= document.getElementById("sb");
//for url submit
if(button){
  button.addEventListener('click', function(){
    var xhr = new XMLHttpRequest();       
    xhr.open("GET", keys.value, true); 
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      var reader = new FileReader();
      reader.onload = function(event) {
          var res = event.target.result;
          image1.src = res;
      }
      var file = this.response;
      reader.readAsDataURL(file);
    };
    xhr.send()
  });
}
const image_input = document.getElementById("image_input");
var uploaded_image = "";
//for upload option
if(image_input){
image_input.addEventListener("change", function(){
  const reader = new FileReader();
  reader.addEventListener("load", ()=>{
    uploaded_image = reader.result;
    image1.src = uploaded_image;
  });
  reader.readAsDataURL(this.files[0]);
});
}



const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


var s = 'Ñ@#W$%[#!)(&^*?!;:+=-,._ ';
const inputSlider = document.getElementById('resolution');
const inputLabel = document.getAnimations('resoltionLabel');
inputSlider.addEventListener('change', handleSlider);
class Cell{
  constructor(x,y ,symbol, color){
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, this.x, this.y)
  }
}
function mapRange (value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}
class Ascii{
  imageCellArray = [];
  pixels = [];
  ctx;
  width;
  height;
  constructor(ctx, width, height){
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.ctx.drawImage(image1, 0 ,0, this.width, this.height);
    this.pixels = this.ctx.getImageData(0,0,this.width, this.height);
  }
  convertToSymbol(g){
    if(g >250) return '@';
    else return s[(parseInt(mapRange(g, 0 , 255, s.length,0 )))];
  }
  scanImage(cellSize){
    this.imageCellArray = [];
    for(let y = 0; y <this.pixels.height; y+= cellSize){
      for(let x = 0; x < this.pixels.width; x+= cellSize){
        //each pixels has 4 members rbgi
        const posX = x*4;
        const posY = y*4;
        //next row
        const pos = (posY*this.pixels.width) + posX;
        //get the last value of rgbi and check transparent
        if(this.pixels.data[pos+3] > 128){
          const red = this.pixels.data[pos];
          const green = this.pixels.data[pos + 1];
          const blue = this.pixels.data[pos +2];
          const total = red + green + blue;
          const averageColorValue = total/3;
          const color = "rgb(" + red + "," + green + "," + blue + ")";
          const symbol = this.convertToSymbol(averageColorValue);
          this.imageCellArray.push(new Cell(x,y,symbol,color));
        }
      }
    }
  }
  drawAscii(){
    this.ctx.clearRect(0,0,this.width, this.height);
    for(let i =0; i<this.imageCellArray.length;i++){
      this.imageCellArray[i].draw(this.ctx);
    }
  }
  draw(cellSize){
    this.scanImage(cellSize);
    this.drawAscii();
  }
}
let effect;
function handleSlider(){
  //full scale
  if(inputSlider.value == 1){
    ctx.drawImage(image1, 0 ,0, canvas.width, canvas.height);
  }
  else{
    ctx.font = parseInt(inputSlider.value)*1.5 +'px Verdana';
    effect.draw(parseInt(inputSlider.value));
  }
}
image1.onload = function (){
  canvas.width = image1.width;
  canvas.height = image1.height;
  effect = new Ascii(ctx, canvas.width, canvas.height);
  effect.draw(2);
}

function download(){
  const imageLink = document.createElement('a');
  imageLink.download = 'canvas.png'
  imageLink.href = canvas.toDataURL('image/png',1);
  imageLink.click();
}




