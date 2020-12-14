const map=new Map();
let currPlayer=1;
const newGameBtn=document.querySelector('#new-game');
const mainBoard=document.querySelector('#board');
let clickable=true;
let trace=new Set();

newGameBtn.addEventListener('click',function(e){
    clickable=true;
    //create empty map
    boardInit();
    //insert a board into the DOM
    createBoard();
    //if a column is pressed, execute the logic
    updatePlayerDOM();
    play();
})

const updatePlayerDOM=()=>{
    console.log(currPlayer);
    if (currPlayer===1){
        document.querySelector('#info>div').classList.add('player1');
        document.querySelector('#info>div').classList.remove('player2');
    }else{
        document.querySelector('#info>div').classList.add('player2');
        document.querySelector('#info>div').classList.remove('player1');
    }
}   

const play=()=>{
    document.querySelector('thead').addEventListener('click',function(e){
        if (clickable&&e.target.tagName==='TH'){
            const columnIdx=e.target.getAttribute('data-index');
            if (!checkIsFilledAt(columnIdx)){
                let idx=0;
                while(idx<6){
                    if (!!map.get(`${idx}${columnIdx}`))
                        idx++;
                    else{
                        map.set(`${idx}${columnIdx}`,currPlayer);
                        insertCircleDOM(`${idx}${columnIdx}`,currPlayer);
                        checkWin(idx,columnIdx);
                        break;
                    } 
                }
                switchPlayer();
            }
        }
    });
}

const fourConnected=(...arr)=>{
    let count=0;
    for(let i=0;i<arr.length-1;i++){
        if (typeof arr[i]==='number' && arr[i]===arr[i+1]){
            count++;
            if (count===3){
                console.log(trace);
                return true;
            }
        }else{
            count=0;
            trace.clear();
        }
    }
    return false;
}

const checkWin=(r,c)=>{
    r=parseInt(r);
    c=parseInt(c);
    if(
        fourConnected(map.get(`${r}${c-3}`),map.get(`${r}${c-2}`),map.get(`${r}${c-1}`),map.get(`${r}${c}`),map.get(`${r}${c+1}`),map.get(`${r}${c+2}`),map.get(`${r}${c+3}`))||
        fourConnected(map.get(`${r}${c}`),map.get(`${r-1}${c}`),map.get(`${r-2}${c}`),map.get(`${r-3}${c}`))||
        fourConnected(map.get(`${r-3}${c-3}`),map.get(`${r-2}${c-2}`),map.get(`${r-1}${c-1}`),map.get(`${r}${c}`),map.get(`${r+1}${c+1}`),map.get(`${r+2}${c+2}`),map.get(`${r+3}${c+3}`))||
        fourConnected(map.get(`${r+3}${c-3}`),map.get(`${r+2}${c-2}`),map.get(`${r+1}${c-1}`),map.get(`${r}${c}`),map.get(`${r-1}${c+1}`),map.get(`${r-2}${c+2}`),map.get(`${r-3}${c+3}`))
    ){
        clickable=false;
        setTimeout(function(){
            alert(currPlayer+'won');
        },500);
    }
    
}

const switchPlayer=()=>{
    currPlayer=currPlayer===1?2:1;
    // console.log(currPlayer);
    updatePlayerDOM();
}

const boardInit=()=>{
    mainBoard.innerText='';
    for (let i=0;i<7;i++)
        for (let j=0;j<6;j++)
            map.set(`${i}${j}`,null);
}


const insertCircleDOM=(location,player)=>{
    const circle=document.createElement('div');
    circle.classList.add('player'+player);
    console.log(location);
    const container=document.querySelector(`td[data-location="${location}"`)
    container.append(circle);
}

const checkIsFilledAt=column=>{
    return !!map.get(`5${column}`);
}

const createBoard=()=>{
    const board=document.createElement('table');
    const thead=document.createElement('thead');
    for(let i=0;i<7;i++){
        const th=document.createElement('th');
        th.setAttribute('data-index',i);
        thead.append(th);
    }
    board.append(thead);
    const tbody=document.createElement('tbody');
    for (let i=5;i>=0;i--){
        const tr=document.createElement('tr');
        for (let j=0;j<7;j++){
            const td=document.createElement('td');
            td.setAttribute('data-location',`${i}${j}`);
            tr.append(td);
        }
        tbody.append(tr);
    }
    board.append(tbody);
    mainBoard.append(board);
}

