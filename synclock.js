/* global $, Vue, moment */

/* -------------------------------
 * 日付表示フォーマット用フィルタ
 * --------------------------------
 */
Vue.filter("time-format", function(moment, format) {
  return moment.format(format);
});

/* ----------------------------------
 * 同期クロック用のVueコンストラクタ
 * ----------------------------------
 */
var Synclock = Vue.extend({
  data: function() {
    return {
      localtime: null,  // ブラウザ時刻 (momentインスタンス)
      synctime: null,   // 同期した時刻 (momentインスタンス)
      dt: 0,            // 時刻ずれ (ミリ秒)
      syncCnt: 0,       // 同期回数
      sync: false,      // 同期実行フラグ (trueの場合同期を実行する)
      syncNow: false,   // 同期実行時にtrueになり、0.5秒後にfalseになる
      syncInterval: 10, // 同期実行間隔 (秒)
    };
  },

  created: function() {
    var self = this;

    // 時刻の更新
    (function update() {
      self.localtime = moment();
      self.synctime = moment(self.localtime.valueOf() - self.dt)
      // 時刻再計算は画面描画に合わせる
      requestAnimationFrame(update);
    })();

    // NTPサーバーとの同期
    (function sync() {
      if(self.sync) {
        sync2ntp(self, "https://ntp-a1.nict.go.jp/cgi-bin/json"); // a1サーバーと同期
        sync2ntp(self, "https://ntp-b1.nict.go.jp/cgi-bin/json"); // b1サーバーと同期

        // syncNowの切替
        self.syncNow = true;
        setTimeout( () => { self.syncNow=false; }, 500 );
      }
      // syncはinterval秒ごと
      setTimeout(sync, self.syncInterval*1000);
    })();

  },

  methods: {
    toggleSync: function() {
      this.sync = !this.sync;
    },
    upSyncInterval: function() {
      if (this.syncInterval<10) {
        this.syncInterval++;
      } else if(10<=this.syncInterval && this.syncInterval<30) {
        this.syncInterval += 5;
      } else if (30<=this.syncInterval && this.syncInterval<60) {
        this.syncInterval += 10;
      } else if (60<=this.syncInterval) {
        this.syncInterval += 60;
      }
    },
    downSyncInterval: function() {
      if(5<this.syncInterval && this.syncInterval<=10) {
        this.syncInterval--;
      } else if(10<this.syncInterval && this.syncInterval<=30) {
        this.syncInterval -= 5;
      } else if (30<this.syncInterval && this.syncInterval<=60) {
        this.syncInterval -= 10;
      } else if (60<this.syncInterval) {
        this.syncInterval -= 60;
      }
    },
  }
});


/* -----------------------------------
 * NTPサーバーのAPIをたたいて時刻同期
 * -----------------------------------
 */
function sync2ntp(synclock, url) {
  $.getJSON(url + "?" + (Date.now()/1000), function(json) {
    var ct2 = Date.now();
    var ct1 = json.it*1000;
    var st = json.st*1000;
    var dt = (ct1 + ct2) /2 - st
    synclock.dt = ( synclock.dt*synclock.syncCnt + dt ) / ++synclock.syncCnt;
  });
}
