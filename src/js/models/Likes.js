export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);
        this.persistData();
        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex( el => el.id === id);
        this.likes.splice(index,1);
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex( el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('forkifyLikes', JSON.stringify(this.likes));
    }

    readStorage() {
        const likes = JSON.parse(localStorage.getItem('forkifyLikes'));
        if(likes) this.likes = likes;
    }

}