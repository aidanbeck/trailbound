import { Point, Rectangle } from './Shape.js';

let RENDER_CARD_BORDERS = false;
function toggleDebugBorders() {
    RENDER_CARD_BORDERS = !RENDER_CARD_BORDERS;
}

class Card extends Rectangle {
    constructor(x, y, w, h, texture = null, onClick = null, onHover = null, onRender = null ) {
            
        super(x, y, w, h);

        this.texture = texture
        this.frame = 0;

        this.onHover = onHover;
        this.onClick = onClick;
        this.onRender = onRender;
    }
}

class Deck {

    constructor(texture) {
        this.texture = texture;
        this.frame = 0;

        this.cards = [];
    }

    render(ctx) {

        this.texture.draw(0, 0, this.frame, ctx);

        for (let card of this.cards) {
            card.texture && card.texture.draw(card.x, card.y, card.frame, ctx);
            card.onRender && card.onRender(ctx);
        }

        RENDER_CARD_BORDERS && this.renderCardBorders(ctx);
    }

    renderCardBorders(ctx) {
        ctx.strokeStyle = "red";
        for (let card of this.cards) {
            ctx.strokeRect(card.x, card.y, card.w, card.h);
        }
    }

    click(x, y, ctx) {

        let clickPoint = new Point(x, y);

        for (let card of this.cards) {
            if (clickPoint.overlaps(card)) {
                card.onClick && card.onClick(x, y, ctx);
            }
        }
    }

    hover(x, y, ctx) {
        // document.body.style.cursor = `url('./art/ui/hand.png') -16 -16, auto`;
        let hoverPoint = new Point(x, y);

        for (let card of this.cards) {
            if (hoverPoint.overlaps(card)) {
                card.onHover && card.onHover(x, y, ctx);
            }
        }
    }

}

export { Card, Deck, toggleDebugBorders }