//-----------Food构造函数和newFood()方法-----------------------
(function () {
  var elements = [];
  function Food(x, y, width, height, color) {
      this.x = x || 0;
      this.y = y || 0;
      this.width = width || 20;
      this.height = height || 20;
      this.color = color || "red";
  }
  Food.prototype.newFood = function (map) {
      remove();
      var div = document.createElement("div");
      map.appendChild(div);
      div.style.width = this.width + "px";
      div.style.height = this.height + "px";
      div.style.backgroundColor = this.color;
      div.style.position = "absolute";
      //随机横纵坐标
      this.x = parseInt(Math.random() * (map.clientWidth / this.width)) * this.width;
      this.y = parseInt(Math.random() * (map.clientHeight / this.height)) * this.height;
      div.style.left = this.x + "px";
      div.style.top = this.y + "px";
      elements.push(div);
  };
  function remove() {
      for (var i = 0; i < elements.length; i++) {
          var ele = elements[i];
          ele.parentNode.removeChild(ele);
          elements.splice(i, 1);
      }
  }
  window.Food = Food;
}());
//--------------Snake构造函数和newSnake(),move()方法-------------------------
(function () {
  var elements = [];
  function Snake(width, height, direction) {
      this.width = width || 20;
      this.height = height || 20;
      this.body = [
          {x: 3, y: 2, color: "#5f5959"},//头
          {x: 2, y: 2, color: "gray"},//身体
          {x: 1, y: 2, color: "gray"}//身体
      ];
      this.direction = direction || "right";//移动方向
  }
  Snake.prototype.newSnake = function (map) {
      remove();
      for (var i = 0; i < this.body.length; i++) {
          var obj = this.body[i];
          var div = document.createElement("div");
          map.appendChild(div);
          div.style.position = "absolute";
          div.style.width = this.width + "px";
          div.style.height = this.height + "px";
          //横纵坐标
          div.style.left = obj.x * this.width + "px";
          div.style.top = obj.y * this.height + "px";
          div.style.backgroundColor = obj.color;
          elements.push(div);
      }
  };

  Snake.prototype.move = function (food, map) {
      var i = this.body.length - 1;//2
      for (; i > 0; i--) {
          this.body[i].x = this.body[i - 1].x;
          this.body[i].y = this.body[i - 1].y;
      }
      //判断方向---改变小蛇的头的坐标位置
      switch (this.direction) {
          case "right":
              this.body[0].x += 1;
              break;
          case "left":
              this.body[0].x -= 1;
              break;
          case "top":
              this.body[0].y -= 1;
              break;
          case "bottom":
              this.body[0].y += 1;
              break;
      }

      //判断有没有吃到食物
      var headX=this.body[0].x*this.width;
      var headY=this.body[0].y*this.height;
      if(headX==food.x&&headY==food.y){
          var last=this.body[this.body.length-1];
          //把最后的蛇尾复制一个,重新的加入到小蛇的body中
          this.body.push({
              x:last.x,
              y:last.y,
              color:last.color
          });
          food.newFood(map);
      }
  };
  function remove() {
      var i = elements.length - 1;
      for (; i >= 0; i--) {
          var ele = elements[i];
          ele.parentNode.removeChild(ele);
          elements.splice(i, 1);
      }
  }
  window.Snake = Snake;
}());
//------------------Game构造函数和start()，runSnake()方法---------------------------
(function () {
  var that = null;
  function Game(map) {
      this.food = new Food();//食物对象
      this.snake = new Snake();//小蛇对象
      this.map = map;//地图
      that = this;
  }
  Game.prototype.start = function () {
      this.food.newFood(this.map);
      this.snake.newSnake(this.map);
      this.runSnake(this.food, this.map);
      this.bindKey();
  };
  Game.prototype.runSnake = function (food, map) {
      var timeId = setInterval(function () {
          this.snake.move(food, map);
          this.snake.newSnake(map);
          //横坐标的最大值
          var maxX = map.offsetWidth / this.snake.width;
          //纵坐标的最大值
          var maxY = map.offsetHeight / this.snake.height;
          //小蛇的头的坐标
          var headX = this.snake.body[0].x;
          var headY = this.snake.body[0].y;
          //横坐标
          if (headX < 0 || headX >= maxX) {
              clearInterval(timeId);
              alert("游戏结束");
          }
          //纵坐标
          if (headY < 0 || headY >= maxY) {
              clearInterval(timeId);
              alert("游戏结束");
          }
      }.bind(that), 200);
  };
  Game.prototype.bindKey=function () {
      document.addEventListener("keydown",function (e) {
          //这里的this应该是触发keydown的事件的对象---document,
          //所以,这里的this就是document
          switch (e.keyCode){
              case 37:this.snake.direction="left";break;
              case 38:this.snake.direction="top";break;
              case 39:this.snake.direction="right";break;
              case 40:this.snake.direction="bottom";break;
          }
      }.bind(that),false);
  };
  window.Game = Game;
}());

