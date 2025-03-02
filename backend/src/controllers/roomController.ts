import { rooms, User, Cards } from "../utils/rooms";
import { WebSocket } from "ws";


export function handleJoinUser(socket: WebSocket, message: any) {
  const { userId, name, roomId } = message;

  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      deck: [],
      dealer: { cards: [], points: 0 },
      status: "waiting",
    };
  }

  if (rooms[roomId].players.length > 7){
    socket.send(JSON.stringify({type:"error",message: "Room is full"}));
    return;
  }

  const existingPlayer = rooms[roomId].players.find((p) => p.userId === userId);
  if(existingPlayer){
    socket.send(JSON.stringify({type: "error", message: "You are already in the room"}));
    return;
  } 

  const user: User = {userId, name, socket, game: {cards: [], points: 0}};
  rooms[roomId].players.push(user);

  console.log(`${name} joined room ${roomId}`);

  rooms[roomId].players.forEach((player) => {
    player.socket.send(JSON.stringify({
      type: "user-joined",
      userId,
      name,
      roomId,
      players: rooms[roomId].players.map((p) => ({
        userId: p.userId, 
        name: p.name
      }))
    }))
  });
}

export function handleLeaveUser (socket: WebSocket, message: any){
    const { userId, name, roomId } = message;

      if (!rooms[roomId]) return;

      rooms[roomId].players = rooms[roomId].players.filter((user) => user.userId !== userId);

      console.log(`${name} has left the ${roomId}`);
    
      rooms[roomId].players.forEach((player) => {
        player.socket.send(JSON.stringify({
          type: "user-left",
          userId,
          name, 
          roomId,
          players: rooms[roomId].players.map((p) => ({userId: p.userId, name: p.name}))
        }))
      });

      if(rooms[roomId].players.length === 0){
        delete rooms[roomId];
        console.log(`Room ${roomId} has been removed as it's empty`);
      }
}

const suits = ["H","D","C","S"];
const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

function createDeck() {
  return suits.flatMap((suit)=> ranks.map((rank) => ({rank,suit})));
}

function shuffleDeck(deck: any[]){
  for(let i=deck.length -1; i>0;i--){
    const j= Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j],deck[i]];
  }

  return deck;
}

export function startGame(socket: WebSocket, message: any){
  const {roomId} = message;

  // shuffle the deck
  rooms[roomId].deck = shuffleDeck(createDeck());
  rooms[roomId].status = "dealing";
  rooms[roomId].dealer = { cards: [], points: 0};

  // start giving one card at a time to all players including a dealer
  for(let i = 0; i<2; i++ ){
    rooms[roomId].players.forEach((player) => {
      const currentCard = rooms[roomId].deck.pop();
      player.game?.cards.push(currentCard);
      if (player.game) {
        console.log("inside player game");
        player.game.points = countPoints(player.game.cards);
      }
    //  player.cards?.push(currentCard);


      rooms[roomId].players.forEach((user) => {
        user.socket.send(JSON.stringify({
          type: "card-dealt",
          playerId: player.userId,
          name: player.name,
          game: player.game
        }))
      })
    })

    const dealerCard = rooms[roomId].deck.pop();
    rooms[roomId].dealer.cards.push(dealerCard);
    rooms[roomId].dealer.points = countPoints(rooms[roomId].dealer.cards);

    rooms[roomId].players.forEach((player) => {
      player.socket.send(JSON.stringify({
        type: "dealer-card",
        cards: rooms[roomId].dealer.cards,
        points: rooms[roomId].dealer.points
      }))
    })
    
  }

  
}

function countPoints(cards: any[] | undefined) {
  // const suits = ["H","D","C","S"];
//   const ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  let aceCount = 0;
  let totalPoints = 0;
  
  if(cards !== undefined){
    cards.forEach((card) => {
      console.log("my cards", card);
    let value = card.rank.toUpperCase();

    if(["J","Q","K"].includes(value)){
      totalPoints += 10;
    }else if(value == 'A'){
      aceCount += 1;
      totalPoints += 11;
    }else {
      totalPoints += parseInt(value,10);
    }

    while(totalPoints > 21 && aceCount > 0){
      totalPoints -= 10;
      aceCount -= 1;
    }

  })
  }
  return totalPoints;

}
