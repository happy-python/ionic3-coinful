import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { SearchPage } from '../search/search';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  objectKeys = Object.keys;
  coins: Object;
  likedCoins: Array<string> = ['BTC', 'ETH', 'IOT'];
  details: any;
  toggleIndex: number = -1;

  constructor(
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private storage: Storage,
    private _data: DataProvider) {
  }

  ionViewWillEnter() {
    this.refreshCoins();
  }

  refreshCoins() {
    const load = this.loadCtrl.create({
      content: 'Refreshing...',
      spinner: 'bubbles'
    });
    load.present().then(() => {
      this.storage.get('likedCoins').then((val) => {
        if (!val) {
          this.storage.set('likedCoins', this.likedCoins);
          this._data.getCions(this.likedCoins).subscribe(res => {
            this.coins = res;
            load.dismiss();
          });
        } else {
          this.likedCoins = val;
          this._data.getCions(this.likedCoins).subscribe(res => {
            this.coins = res;
            load.dismiss();
          });
        }
      });
    });
  }

  ondrag() {
    this.toggleIndex = -1;
  }

  removeCoin(coin) {
    this.likedCoins = this.likedCoins.filter(item => {
      return item !== coin;
    });
    this.storage.set('likedCoins', this.likedCoins);
    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }

  coinDetails(coin, index) {
    if (this.toggleIndex == index) {
      this.toggleIndex = -1;
    } else {
      this._data.getCoin(coin)
        .subscribe(res => {
          this.toggleIndex = index;
          this.details = res['DISPLAY'][coin]['USD'];
          
          this._data.getChart(coin)
            .subscribe(res => {
              let coinHistory = res['Data'].map((d) => (d.close));
              setTimeout(() => {
                new Chart('canvas' + index, {
                  type: 'line',
                  data: {
                    labels: coinHistory,
                    datasets: [{
                      data: coinHistory,
                      borderColor: "#3cba9f",
                      fill: false
                    }
                    ]
                  },
                  options: {
                    tooltips: {
                      callbacks: {
                        label: function (tooltipItems, data) {
                          return "$ " + tooltipItems.yLabel.toString();
                        }
                      }
                    },
                    responsive: false,
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: false
                      }],
                      yAxes: [{
                        display: false
                      }],
                    }
                  }
                });
              }, 250);
            });
        });
    }
  }

  showSearch() {
    this.navCtrl.push(SearchPage);
  }

}
