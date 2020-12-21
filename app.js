

class Game{
    constructor(height,width){
        [this.height,this.width]=[height,width];
        this.clickable=true;
        this.board=new Map();
        this.currPlayer=1;
        this.player1=null;
        this.player2=null;
    }
    //Add player objects into the game object
    addPlayers(player1,player2){
        if (player1 instanceof Player && player2 instanceof Player){
            this.player1=player1;
            this.player2=player2;
            return true;
        }
        return false;
    }
    //When the player is switched, the corresponding player's color is switched too
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
    //add event handler to the first row 
    handleClick(){
        document.querySelector('thead').addEventListener('click',function(e){
            if (this.clickable&&e.target.tagName==='TH'){
                const columnIdx=e.target.getAttribute('data-index');
                if (!this.checkIsFilledAt(columnIdx)){
                    let rowIdx=0;
                    while(rowIdx<this.height){
                        if (!!this.board.get(`${rowIdx}${columnIdx}`))
                            rowIdx++;
                        else{
                            this.board.set(`${rowIdx}${columnIdx}`,this.currPlayer);
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
    //check if there are four same color connected  
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
    //check win conditions at current position with row and column
    checkWin(r,c){
        r=parseInt(r);
        c=parseInt(c);
        const rowCondition=this.fourConnected(this.board.get(`${r}${c-3}`),this.board.get(`${r}${c-2}`),this.board.get(`${r}${c-1}`),this.board.get(`${r}${c}`),this.board.get(`${r}${c+1}`),this.board.get(`${r}${c+2}`),this.board.get(`${r}${c+3}`));
        const columnCondition=this.fourConnected(this.board.get(`${r}${c}`),this.board.get(`${r-1}${c}`),this.board.get(`${r-2}${c}`),this.board.get(`${r-3}${c}`));
        const dia1Condition=this.fourConnected(this.board.get(`${r-3}${c-3}`),this.board.get(`${r-2}${c-2}`),this.board.get(`${r-1}${c-1}`),this.board.get(`${r}${c}`),this.board.get(`${r+1}${c+1}`),this.board.get(`${r+2}${c+2}`),this.board.get(`${r+3}${c+3}`));
        const dia2Condition=this.fourConnected(this.board.get(`${r+3}${c-3}`),this.board.get(`${r+2}${c-2}`),this.board.get(`${r+1}${c-1}`),this.board.get(`${r}${c}`),this.board.get(`${r-1}${c+1}`),this.board.get(`${r-2}${c+2}`),this.board.get(`${r-3}${c+3}`));
        if(rowCondition||columnCondition||dia1Condition||dia2Condition){
            this.clickable=false;
            setTimeout(function(){
                this.switchPlayer();
                alert('Player '+this.currPlayer+' have won');
                document.querySelector('#player1').value='';
                document.querySelector('#player2').value='';
            }.bind(this),500);
        }
        
    }
    //switch player after a turn
    switchPlayer(){
        this.currPlayer=this.currPlayer===1?2:1;
        this.updatePlayerDOM();
    }
    //create a empty board
    boardInit(height,width){
        document.querySelector('#board').innerText='';
        for (let i=0;i<width;i++)
            for (let j=0;j<height;j++)
                this.board.set(`${i}${j}`,null);
    }
    //insert circle into the board (DOM)
    insertCircleDOM(location,player){
        const circle=document.createElement('div');
        circle.classList.add('player'+player);
        circle.style.backgroundColor=this[`player${this.currPlayer}`].color;
        const container=document.querySelector(`td[data-location="${location}"`)
        container.append(circle);
    }
    //check if the current column is full
    checkIsFilledAt(column){
        return !!this.board.get(`${this.height-1}${column}`);
    } 
    //create HTML board in DOM
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
    //Play steps
    play(){
        //empty board created
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

const isColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
  }

//Form submit handler
document.querySelector('form').addEventListener('click',function(e){
    e.preventDefault();
    if (e.target.tagName==='BUTTON'){
        clickable=true;
        const gameInstance=new Game(6,7);
        const player1=new Player(document.querySelector('#player1').value);
        const player2=new Player(document.querySelector('#player2').value);
        
        if (isColor(player1.color)&&isColor(player2.color)){
            gameInstance.addPlayers(player1,player2);
            gameInstance.play();
        }else{
            alert('Please provide valid colors!');
            document.querySelector('#player1').value='';
            document.querySelector('#player2').value='';
        }

    }
})

