EmuLabeller.Drawer.OsciDrawer = {

    init: function(params) {
        this.waveColor = 'white';
        this.progressColor = 'grey';
        //
        this.peaks = [];
        this.maxPeak = -Infinity;

    },

    getPeaks: function(buffer, vP, canvas) {

        var k = (vP.eS - vP.sS) / canvas.width; // PCM Samples per new pixel

        this.peaks = [];
        // this.minPeak = Infinity;
        this.maxPeak = -Infinity;

        var chan = buffer.getChannelData(c);
        // console.log(chan);
        var relData = chan.subarray(vP.sS, vP.eS);

        if (k <= 1) {
            console.log("over sample exact!!!");
            relData = chan.subarray(vP.sS, vP.eS + 1);
            // this.minPeak = Math.min.apply(Math, relData);
            this.maxPeak = Math.max.apply(Math, relData);
            this.peaks = Array.prototype.slice.call(relData);
        } else {


            for (var i = 0; i < canvas.width; i++) {
                var sum = 0;
                for (var c = 0; c < buffer.numberOfChannels; c++) {

                    var vals = relData.subarray(i * k, (i + 1) * k);
                    var peak = -Infinity;

                    var av = 0;
                    for (var p = 0, l = vals.length; p < l; p++) {
                        //console.log(p);
                        if (vals[p] > peak) {
                            peak = vals[p];
                        }
                        av += vals[p];
                    }
                    //sum += peak;
                    sum += av / vals.length;
                }

                this.peaks[i] = sum;
                if (sum > this.maxPeak) {
                    this.maxPeak = sum;
                }
            }
        } //else
    },

    drawOsciOnCanvas: function(buffer, vP, canvas) {
        //this.resizeCanvases();
        var my = this;
        var cc = canvas.getContext("2d");

        // this.clear();

        var k = (vP.eS - vP.sS) / canvas.width; // PCM Samples per new pixel
        // Draw WebAudio buffer peaks using draw frame
        if (this.peaks && k >= 1) {
            this.peaks.forEach(function(peak, index) {
                if (index !== 0) {
                    my.drawFrame(index, peak, my.maxPeak, my.peaks[index - 1], canvas);
                }
            });
            // over sample exact
        }
        // else if (k < 1) {
        //     this.cc.strokeStyle = this.params.waveColor;
        //     this.cc.beginPath();
        //     this.cc.moveTo(0, (this.peaks[0] - my.minPeak) / (my.maxPeak - my.minPeak) * this.osciHeight);
        //     for (var i = 1; i < this.peaks.length; i++) {
        //         this.cc.lineTo(i / k, (this.peaks[i] - my.minPeak) / (my.maxPeak - my.minPeak) * this.osciHeight);
        //     }
        //     this.cc.lineTo(this.osciWidth, (this.peaks[i] - my.minPeak) / (my.maxPeak - my.minPeak) * this.osciHeight); // SIC SIC SIC tail
        //     this.cc.stroke();
        // }

        // this.drawCursor();
    },

    drawVpOsciMarkup: function(buffer, vP, canvas) {
        var my = this;
        var cc = canvas.getContext("2d");
        //console.log(vP);
        cc.strokeStyle = this.waveColor;

        //this.cc.fillRect(x, y, w, h);
        cc.beginPath();
        cc.moveTo(0, 0);
        cc.lineTo(5, 5);
        cc.moveTo(canvas.width, 0);
        cc.lineTo(canvas.width - 5, 5);
        cc.moveTo(0, canvas.height / 2);
        cc.lineTo(canvas.width, canvas.height / 2);

        cc.closePath();
        cc.stroke();

        if (vP) {
            cc.font = "12px Verdana";
            var metrics = cc.measureText(Math.floor(vP.eS));
            cc.strokeText(Math.floor(vP.sS), 5, 5 + 8);
            cc.strokeText(Math.floor(vP.eS), canvas.width - metrics.width - 5, 5 + 8);
        }

        //draw vPselected
        if (vP.selectS !== 0 && vP.selectE !== 0) {
            var all = vP.eS - vP.sS;
            var fracS = vP.selectS - vP.sS;
            var procS = fracS / all;
            var posS = canvas.width * procS;

            var fracE = vP.selectE - vP.sS;
            var procE = fracE / all;
            var posE = canvas.width * procE;

            cc.fillStyle = "rgba(0, 0, 255, 0.2)";
            cc.fillRect(posS, 0, posE - posS, canvas.height);

            cc.strokeStyle = "rgba(0, 255, 0, 0.5)";
            cc.beginPath();
            cc.moveTo(posS, 0);
            cc.lineTo(posS, canvas.height);
            cc.moveTo(posE, 0);
            cc.lineTo(posE, canvas.height);
            cc.closePath();
            cc.stroke();

            cc.strokeStyle = this.waveColor;
            if (vP.selectS == vP.selectE) {
                cc.strokeText(Math.floor(vP.selectS), posS + 5, 10);
            } else {
                var tW = cc.measureText(Math.floor(vP.selectS)).width;
                cc.strokeText(Math.floor(vP.selectS), posS - tW - 4, 10);
                cc.strokeText(Math.floor(vP.selectE), posE + 5, 10);

            }
        }
    },

    drawFrame: function(index, value, max, prevPeak, canvas) {
        var cc = canvas.getContext('2d');
        //cur
        var w = 1;
        var h = Math.round(value * (canvas.height / max)); //rel to max
        var x = index * w;
        var y = Math.round((canvas.height - h) / 2);

        //prev
        var prevW = 1;
        var prevH = Math.round(prevPeak * (canvas.height / max));
        var prevX = (index - 1) * w;
        var prevY = Math.round((canvas.height - prevH) / 2);


        if (this.cursorPos >= x) {
            cc.fillStyle = this.progressColor;
            cc.strokeStyle = this.progressColor;
        } else {
            cc.fillStyle = this.waveColor;
            cc.strokeStyle = this.waveColor;
        }

        cc.beginPath();
        cc.moveTo(prevX, prevY);
        cc.lineTo(x, y);
        //this.cc.closePath();
        cc.stroke();


    },

    redrawOsciOnCanvas: function(buffer, canvas, vP) {
        console.log("###########");
        console.log("redrawing osci");
        osciWidth = canvas.width;
        osciHeight = canvas.height;

        this.getPeaks(buffer, vP, canvas);
        console.log(this.peaks);
        this.drawOsciOnCanvas(buffer, vP, canvas);
        this.drawVpOsciMarkup(buffer, vP, canvas);
    }
};