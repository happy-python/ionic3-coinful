import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  objectKeys = Object.keys;
  coins: Object;
  allcoins: Object;
  likedCoins: any;

  constructor(
    private loadCtrl: LoadingController,
    private storage: Storage,
    private _data: DataProvider) {
  }

  ionViewDidLoad() {
    const load = this.loadCtrl.create({
      content: 'Loading...',
      spinner: 'bubbles'
    });
    load.present().then(() => {
      this.storage.get('likedCoins').then((val) => {
        this.likedCoins = val;
      });
      this._data.allCoins().subscribe(res => {
        this.allcoins = this.coins = res['Data'];
        load.dismiss();
      });
    });
  }

  searchCoins(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.coins = Object.keys(this.allcoins).filter((key) => {
        return key.includes(val.toUpperCase());
      }).reduce((obj, key) => {
        obj[key] = this.allcoins[key];
        return obj;
      }, {});
    }
  }

  addCoin(coin) {
    this.likedCoins.push(coin);
    this.storage.set('likedCoins', this.likedCoins);
  }

}
