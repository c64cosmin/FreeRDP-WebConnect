var LoginMenu = function(){
    this.elem = document.createElement("div");
    document.body.appendChild(this.elem);
    this.elem.id = "loginmenu";
    this.heightTarget = 1;
    this.height = 0;
    this.width = 0.15;
    this.xTarget = 0;
    this.x = 0;
    this.y = window.innerHeight*(1.0 - this.height)*0.5;
    this.buttonHeight = 40;
    this.state = "centered";
    this.elem.style["position"] = "absolute";
    this.elem.style["width"] = window.innerWidth * this.width + "px";
    this.elem.style["height"] = window.innerHeight * this.height + "px";
    this.elem.style["left"] = this.x + "px";
    this.elem.style["top"] = this.y + "px";
    this.elem.style["overflow"] = "hidden";
    this.entries = [];
    this.entries.push(new TextEntry(this.elem, "Woot"));
    this.entries.push(new TextEntry(this.elem, "Woot"));
    this.update = function(){
        if(this.state == "centered"){
            this.heightTarget = (this.entries.length * this.buttonHeight) / window.innerHeight;
            this.xTarget = window.innerWidth * (1-this.width) * 0.5
        }
        if(this.state == "left"){
            this.heightTarget = 1;
            this.xTarget = 0;
        }
        this.x += (this.xTarget - this.x)*0.1;
        this.y = window.innerHeight*(1.0 - this.height)*0.5;
        this.height += (this.heightTarget - this.height)*0.1;
        this.elem.style["height"] = window.innerHeight * this.height + "px";
        this.elem.style["left"] = this.x + "px";
        this.elem.style["top"] = this.y + "px";
        for(var i=0;i<this.entries.length;i++){
            this.entries[i].update(this.buttonHeight);
        }
    }
}

var TextEntry = function(parent, caption){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.height = 0;
    this.caption = caption;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["background-color"] = "#ff0000";
    this.elem.style["margin-bottom"] = "1px";
    this.elem.style["overflow"] = "hidden";
    this.elem.className = "textentry";
    this.elem.innerHTML = caption;
    this.update = function(pixelHeight){
        this.height += (pixelHeight - 1 - this.height)*0.1;
        this.elem.style["height"] = this.height + "px";
    }
}
