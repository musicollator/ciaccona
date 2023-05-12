class MagnificentTitle {
    templateForTheme
    where
    constructor(clazz, where, incl) {
        this.clazz = clazz
        this.where = where && 1 <= where && where <= 3 ? where : 0 // 1, 2, 3
        // where can be left middle right
        this.arrow_out_left = `<svg id="arrow_out_left" class="magnificient-arrow left" viewBox="0 0 20 20">
            <path d="m4.671 5.06 1.454 1.348L3.697 9h8.366v2H3.697l2.428 2.544-1.454 1.362L0 9.958ZM10 0v4h2V2h6v16h-6v-2h-2v4h10V0Z"/>
        </svg>`
        this.arrow_in_left = `<svg id="arrow_in_left" class="magnificient-arrow left" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.757 10.233 13 5.99V9h7v2h-7v3.476l-5.243-4.243ZM10 4H8V2H2v16h6v-2h2v4H0V0h10v4Z"/>
        </svg>`
        this.arrow_in_right = `<svg id="arrow_in_right" class="magnificient-arrow right" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.392 5.06 5.938 6.408 8.366 9H0v2h8.366l-2.428 2.544 1.454 1.362 4.671-4.948L7.392 5.06ZM10 0v4h2V2h6v16h-6v-2h-2v4h10V0H10Z" />
        </svg>`
        this.arrow_out_right = `<svg id="arrow_out_right" class="magnificient-arrow right" viewBox="0 0 20 20">
            <path d="m15.329 5.06-1.454 1.348L16.303 9H7.937v2h8.366l-2.428 2.544 1.454 1.362L20 9.958ZM10 0v4H8V2H2v16h6v-2h2v4H0V0Z"/>
        </svg>`
        this.templateForTheme =
`<div id="magnificent-title-ciaccona" class="${this.clazz} d-flex justify-content-center flex-column" data-sort="-1">
    <div class="d-flex justify-content-center" style="width: 100%;">
        <div class="magnificent-card">
            <a id="pane-artists" data-pane="left" href="/" aria-label="Artists...">
                ${this.where == 2 ? this.arrow_in_left : ''}
                ${this.where == 3 ? this.arrow_out_left : ''}
            </a>
            <div style="user-select: none; font-size: 28px;">Ciaccona</div>
            <a id="pane-ciaccona" data-pane="right" href="/ciaccona.html" aria-label="Ciaccona...">
                ${this.where == 1 ? this.arrow_in_right : ''}
                ${this.where == 3 ? this.arrow_out_right : ''}
            </a>
        </div>
    </div>
    ${incl ? incl : ''}
</div>`
    }
}
/*
        </div>
 
        */
export default MagnificentTitle