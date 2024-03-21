import { LightningElement, track, api } from 'lwc';

export default class VirtualScrolling extends LightningElement {

    @track alldata = [];
    @track viewHeight = 500;
    @track rowheight = 40;
    @track visibledata = [];
    @track offsetY = 0;

    totalHeight=0;
    alldataLength = 0;
    visibleRowCount = 0;
    startRowIndex = 0;
    bufferRowCount = 5;
    
    scrollHandler() {
        this.calcVisibleData(false);
    }

    calcVisibleData(firstTime) {
        if(firstTime === false) {
            const scrollTop = this.getScrollTop();
            const lastIndex = this.startRowIndex;
            this.startRowIndex = Math.floor(scrollTop / this.rowheight) - this.bufferRowCount;
            this.startRowIndex = Math.max(0, this.startRowIndex);
            if(lastIndex === this.startRowIndex) return;
        }
        this.visibleRowCount = Math.ceil(this.viewHeight / this.rowheight) + 2 * this.bufferRowCount;
        this.visibleRowCount = Math.min(this.alldata.length - this.startRowIndex, this.visibleRowCount);
        this.offsetY = this.startRowIndex * this.rowheight;
        this.visibledata = this.getVisibleData();
    }

    getVisibleData() {
        let endIndex = this.startRowIndex + this.visibleRowCount;
        return this.alldata.slice(this.startRowIndex, endIndex);
    }

    getScrollTop() {
        const element = this.template.querySelector('.viewport');
        return element.scrollTop;
    }

    get transformStyle() {
        return `
            transform: translateY(${this.offsetY}px);
        `;
    }
    
    get rowStyle() {
        return `
            height: ${this.rowheight}px;
            background-color:beige;
        `;
      }

    get contentStyle() {
        return `
            height: ${this.totalHeight}px;
        `;
    }

    get viewportStyle() {
        return `
            max-height: ${this.viewHeight}px; 
            overflow: auto;
            height:auto;
        `;
    }

     async connectedCallback() {
        this.alldata = await this.getData({ amountOfRecords: 100000 });
        console.log('a'+this.alldata);
        this.alldataLength = this.alldata.length;
        console.log('All Data Length'+this.alldataLength);
        console.log('RH'+this.rowheight);
        this.totalHeight = this.alldataLength * this.rowheight;

        this.calcVisibleData(true);
    }

    @api 
    getData({ amountOfRecords }) {
        const response = [];
        for(let index = 1; index < amountOfRecords; index++) {
            response.push({
                id: index, 
                name: `dummy${index}`, 
                email: `dummy${index}@xxx.yyy`
            });
        }
        return response;
    }
}
