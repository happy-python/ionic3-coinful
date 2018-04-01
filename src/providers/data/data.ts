import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataProvider {

  constructor(public _http: HttpClient) {
  }

  getCions(coinList: Array<string>) {
    let coins = coinList.join();
    return this._http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + coins + "&tsyms=USD");
  }

  getCoin(coin: string) {
    return this._http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + coin + "&tsyms=USD");
  }

  getChart(coin) {
    return this._http.get("https://min-api.cryptocompare.com/data/histoday?fsym=" + coin + "&tsym=USD&limit=30&aggregate=1");
  }

  allCoins() {
    return this._http.get("https://min-api.cryptocompare.com/data/all/coinlist");
  }

}
