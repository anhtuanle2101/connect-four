

class Game{
    constructor(height,width){
        [this.height,this.width]=[height,width];
        this.clickable=true;
        this.map=new Map();
        this.currPlayer=1;
        this.player1=null;
        this.player2=null;
    }
    addPlayers(player1,player2){
        if (player1 instanceof Player && player2 instanceof Player){
            this.player1=player1;
            this.player2=player2;
            return true;
        }
        return false;
    }
    updatePlayerDOM(){
        document.querySelector('#info>div').style.backgroundColor=this[`player${this.currPlayer}`].color
        if (this.currPlayer===1){
            document.querySelector('#info>div').classList.add('player1');
            document.querySelector('#info>div').classList.remove('player2');
        }else{
            document.querySelector('#info>div').classList.add('player2');
            document.querySelector('#info>div').classList.remove('player1');
        }
    }  
    handleClick(){
        document.querySelector('thead').addEventListener('click',function(e){
            if (this.clickable&&e.target.tagName==='TH'){
                const columnIdx=e.target.getAttribute('data-index');
                if (!this.checkIsFilledAt(columnIdx)){
                    let rowIdx=0;
                    while(rowIdx<this.height){
                        if (!!this.map.get(`${rowIdx}${columnIdx}`))
                            rowIdx++;
                        else{
                            this.map.set(`${rowIdx}${columnIdx}`,this.currPlayer);
                            this.insertCircleDOM(`${rowIdx}${columnIdx}`,this.currPlayer);
                            this.checkWin(rowIdx,columnIdx);
                            break;
                        } 
                    }
                    this.switchPlayer();
                }
            }
        }.bind(this));
    }
    fourConnected(...arr){
        let count=0;
        for(let i=0;i<arr.length-1;i++){
            if (typeof arr[i]==='number' && arr[i]===arr[i+1]){
                count++;
                if (count===3){
                    return true;
                }
            }else{
                count=0;
            }
        }
        return false;
    }
    checkWin(r,c){
        r=parseInt(r);
        c=parseInt(c);
        if(
            this.fourConnected(this.map.get(`${r}${c-3}`),this.map.get(`${r}${c-2}`),this.map.get(`${r}${c-1}`),this.map.get(`${r}${c}`),this.map.get(`${r}${c+1}`),this.map.get(`${r}${c+2}`),this.map.get(`${r}${c+3}`))||
            this.fourConnected(this.map.get(`${r}${c}`),this.map.get(`${r-1}${c}`),this.map.get(`${r-2}${c}`),this.map.get(`${r-3}${c}`))||
            this.fourConnected(this.map.get(`${r-3}${c-3}`),this.map.get(`${r-2}${c-2}`),this.map.get(`${r-1}${c-1}`),this.map.get(`${r}${c}`),this.map.get(`${r+1}${c+1}`),this.map.get(`${r+2}${c+2}`),this.map.get(`${r+3}${c+3}`))||
            this.fourConnected(this.map.get(`${r+3}${c-3}`),this.map.get(`${r+2}${c-2}`),this.map.get(`${r+1}${c-1}`),this.map.get(`${r}${c}`),this.map.get(`${r-1}${c+1}`),this.map.get(`${r-2}${c+2}`),this.map.get(`${r-3}${c+3}`))
        ){
            this.clickable=false;
            setTimeout(function(){
                alert('Player '+this.currPlayer+' have won');
            }.bind(this),500);
        }
        
    }
    switchPlayer(){
        this.currPlayer=this.currPlayer===1?2:1;
        this.updatePlayerDOM();
    }
    boardInit(height,width){
        document.querySelector('#board').innerText='';
        for (let i=0;i<width;i++)
            for (let j=0;j<height;j++)
                this.map.set(`${i}${j}`,null);
    }
    insertCircleDOM(location,player){
        const circle=document.createElement('div');
        circle.classList.add('player'+player);
        circle.style.backgroundColor=this[`player${this.currPlayer}`].color;
        const container=document.querySelector(`td[data-location="${location}"`)
        container.append(circle);
    }
    checkIsFilledAt(column){
        return !!this.map.get(`${this.height-1}${column}`);
    } 
    createHTMLBoard(){
        const board=document.createElement('table');
        const thead=document.createElement('thead');
        for(let i=0;i<this.width;i++){
            const th=document.createElement('th');
            th.setAttribute('data-index',i);
            thead.append(th);
        }
        board.append(thead);
        const tbody=document.createElement('tbody');
        for (let i=this.height-1;i>=0;i--){
            const tr=document.createElement('tr');
            for (let j=0;j<7;j++){
                const td=document.createElement('td');
                td.setAttribute('data-location',`${i}${j}`);
                tr.append(td);
            }
            tbody.append(tr);
        }
        board.append(tbody);
        document.querySelector('#board').append(board);
    }
    play(){
        //empty map created
        this.boardInit();
        //implement the board (map) into DOM
        this.createHTMLBoard();
        //show the current player color
        this.updatePlayerDOM();
        //handle clicks
        this.handleClick();
    }
}

class Player{
    constructor(color){
        this.color=color;
    }
}

// const newGameBtn=document.querySelector('#new-game');
// newGameBtn.addEventListener('click',function(e){
//     e.preventDefault();
//     clickable=true;
//     const gameInstance=new Game(6,7);
//     const player1=new Player(document.querySelector('#player1').value);
//     const player2=new Player(document.querySelector('#player2').value);
//     console.log(player1.color,player2.color);
//     if (player1.color && player2.color)
//         gameInstance.play();
// })
document.querySelector('form').addEventListener('click',function(e){
    e.preventDefault();
    if (e.target.tagName==='BUTTON'){
        clickable=true;
        const gameInstance=new Game(6,7);
        const player1=new Player(document.querySelector('#player1').value);
        const player2=new Player(document.querySelector('#player2').value);
       
        if (!!(player1.color && player2.color))
            gameInstance.addPlayers(player1,player2);
            gameInstance.play();
        }
})

