import { AfterContentInit, Component, OnChanges, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { QueryCommandInterface } from 'src/app/common/models/query_commands_interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.scss']
})
export class SalesDashboardComponent implements OnInit , OnChanges, AfterContentInit{




// /////////////////////////////////////////////////////////////////////////////////////////////////////////////


  lineChart: any;
  cumulativeChart: any;
  suppliersChart: any;
  data: any[];
  locationLabels: any[] = [];
  locationData: any[] = [];
  salesPeriods: string[] = ['Days', 'Weeks', 'Months'];
  datedSalesData: any[];
  displayLabels: any[];
  displayData: any[];
  showDaily: Boolean = false;
  universalScheme: string[] = ["#FF4500", "#0d98ba", "#00b287", "#fea400", "#b27300"];
  _queryCommandInterface;
  public totalSales: number;
  public totalSalesCount: number;
  public nowTotal: number;
  public laterTotal: number;
  public deliveryTotal: number;

  constructor(
    private httpService: HttpService
  ) { }
  
  ngAfterContentInit(): void {
    this.chartSupplierSalesTime();
    // console.log("View has been initiated");
  }

  ngOnInit(): void {
    this.loadSalesData();
    this.chartDailySales();
  }

  ngOnChanges(): void {
    this.chartSupplierSalesTime();
    // console.log("View has been initiated");
    // this.chartPurchaseType();
    // this.loadSalesData();
    // this.chartSuppliers();
    // this.chartDefaulters();
    // this.chartPurchaseStatus();
  }
  
  

  public chartClicked(e:any):void {
    console.log(e);
  }
 
 // event on pie chart slice hover
  public chartHovered(e:any):void {
    console.log(e);
  }

  chartOnlineSales(): void {
    let cntx = document.getElementById('oordersCanvas') as HTMLCanvasElement;
    new Chart(cntx.getContext('2d'), {
      type: "pie",
      data: {
        labels: ["Crown", "SME"],
        datasets: [
          {
            data: [7263, 7263],
            backgroundColor: this.universalScheme
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }

  // retrieves purchase data
  loadSalesData(): void {
    //console.log("we got to the sales function");
    let salesArray = [];
    let salesCountArray = [];
    this._queryCommandInterface = new QueryCommandInterface();
    this._queryCommandInterface.data.transaction_details = {
      dateFrom: "2020-06-09",
      dateTo: "2021-06-09",
      depotCode: "",
      territoryCode: "",
      brand: "",
      pack: "",
      routeID: "",
      userName: "",
      regionCode: "",
      offset: "0",
      resource: "fetchCRDailySalesReport",
      url: ""
    };
    this.httpService.getSalesData(this._queryCommandInterface).subscribe(result => {
      this.data = result['data']['purchase_orders'].reverse();
      // console.log("sales data: ", result);
      this.data.map(item => {
        salesArray.push(item['totalcost']);
        salesCountArray.push(item['itemcount']);
        //this.locationLabels.push(item['storelocation']);
      })
      this.totalSales = salesArray.reduce((a, b) => a + b, 0);
      this.totalSalesCount = salesCountArray.reduce((a, b) => a + b, 0);
      this.chartSupplierSalesTime();
      this.chartSuppliers();
      this.chartPaymentMethod();
      this.chartOnlineSales();
      this.chartSalesLocation();
      this.chartPurchaseStatus();
      this.chartPurchaseType();
    })
  }

  //visualizes total sales by region
  chartSalesLocation(): void {
    let uniqueLocations;
    let uniqueObject = {};
    this.data.map(item => {
      this.locationLabels.push(item['storelocation']);
      this.locationData.push(item['totalcost']);
    })
    uniqueLocations = Array.from(new Set(this.locationLabels));

    uniqueLocations.map(loc => {
      this.data.map(item => {
        if (loc == item['storelocation']) {
          let newSum = [];
          newSum.push(item['totalcost']);
          uniqueObject[loc] = newSum.reduce((a, b) => a + b, 0);
        }
      })
    })
    //console.log('optimistic data: ', uniqueObject);
    let newLocationsData = this.locationData.reduce((a, b) => a + b, 0);
    // console.log('location data: ', newLocationsData);
    // console.log("location labels: ", uniqueLocations);
    let cntx = document.getElementById('regionCanvas') as HTMLCanvasElement;
    new Chart(cntx.getContext('2d'), {
      type: "pie",
      data: {
        labels: uniqueLocations,
        datasets: [
          {
            data: [newLocationsData],
            backgroundColor: this.universalScheme
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }

  //visualizes total sales per days/weeks/months
  chartDatedSales(event): void {
    this.showDaily = false;
    let dailyLabels = [];
    let dailyData = [];
    let weeklyLabels = [];
    let weeklyData = [];
    let monthlyLabels = [];
    let monthlyData = [];
    let salesPeriod = event.value;
    this._queryCommandInterface = new QueryCommandInterface();
    this._queryCommandInterface.data.transaction_details = {
      resource: "fetchCRDailySalesStatisticalData",
      startDate:"2021-01-03",
      endDate:"2021-10-09",
      period: salesPeriod 
    };
    this.httpService.getSalesData(this._queryCommandInterface).subscribe(res => {
      this.datedSalesData = res['data']['statistical_data'];
      //console.log('dated data: ', this.datedSalesData);
      if (salesPeriod === 'Days') {
        this.datedSalesData.map(item => {
          dailyLabels.push(item['day']);
          dailyData.push(item['total']);
        })
      } else if (salesPeriod === "Weeks") {
        this.datedSalesData.map(item => {
          weeklyLabels.push(item['first_dayofthe_week']);
          weeklyData.push(item['total'])
        })
      } else {
        this.datedSalesData.map(item => {
          monthlyLabels.push(item['month']);
          monthlyData.push(item['total'])
        })
      }
      //toggle data and labels to be displayed 
      if (salesPeriod === 'Days') {
        this.displayLabels = dailyLabels;
        this.displayData = dailyData;
      } else if (salesPeriod === 'Weeks') {
        this.displayLabels = weeklyLabels;
        this.displayData = weeklyData;
      } else if (salesPeriod === "Months") {
        this.displayLabels = monthlyLabels;
        this.displayData = monthlyData;
      }

      let cntx = document.getElementById("salesCanvas") as HTMLCanvasElement;
      this.lineChart = new Chart(cntx.getContext('2d'), {
        type: 'line',
        data: {
          labels: this.displayLabels,
          datasets: [
            {
              label: "Sales Data",
              fill: true,
              backgroundColor: "rgba(40,125,200,.5)",
              borderColor: "rgb(40,100,200)",
              lineTension: 0.1,
              data: this.displayData,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    })

  }

  //visualizes daily sales data
  chartDailySales(): void {
    this.showDaily = true;
    let dailyLabels = [];
    let dailyData = [];
    this._queryCommandInterface = new QueryCommandInterface();
    this._queryCommandInterface.data.transaction_details = {
      resource: "fetchCRDailySalesStatisticalData",
      startDate:"2021-01-03",
      endDate:"2021-10-09",
      period: "days" 
    };
    this.httpService.getSalesData(this._queryCommandInterface).subscribe(res => {
      res['data']['statistical_data'].map(item => {
        dailyLabels.push(item['day']);
        dailyData.push(item['total']);
      });
      let cntx = document.getElementById("dailyCanvas") as HTMLCanvasElement;
      this.lineChart = new Chart(cntx.getContext('2d'), {
        type: 'line',
        data: {
          labels: dailyLabels,
          datasets: [
            {
              label: "Sales Data",
              fill: true,
              backgroundColor: "rgba(40,125,200,.5)",
              borderColor: "rgb(40,100,200)",
              lineTension: 0.1,
              data: dailyData,
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    })
  }

  //visualizes defaulters over time
  chartDefaulters(): void {
    let cntx = document.getElementById('defaultersCanvas') as HTMLCanvasElement;
    new Chart(cntx.getContext('2d'), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
        datasets: [
          {
            label: "Defaulters",
            fill: true,
            data: [0, 165, 160, 155, 165, 155],
            backgroundColor: "rgba(40,125,200,.5)",
            borderColor: "#0d98ba",
            lineTension: 0.1,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }

  //charts sales/suppliers
  chartSuppliers(): void {
    let cntx = document.getElementById("sordersCanvas") as HTMLCanvasElement;
    this.suppliersChart = new Chart(cntx.getContext('2d'), {
      type: "pie",
      data: {
        labels: ["EABL", "BAT", "ARAT"],
        datasets: [
          {
            data: [5896, 4825, 4805],
            backgroundColor: this.universalScheme
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }

  //chart sales/payment method
  chartPaymentMethod(): void {
    let cashPayments = [];
    let mpesaPayments = [];
    let cardPayments = [];

    this.data.map(item => {
      if (item['paymenttype'] == 'mpesa') {
        mpesaPayments.push(item['totalcost']);
      } else if (item['paymenttype'] == 'cash') {
        cashPayments.push(item['totalcost']);
      } else if (item['paymenttype'] == 'card') {
        cardPayments.push(item['totalcost']);
      } else {
        cashPayments.push(item['totalcost']);
      }
    })

    let cashData = cashPayments.reduce((a, b) => a + b, 0);
    let cardData = cardPayments.reduce((a, b) => a + b, 0);
    let mpesaData = mpesaPayments.reduce((a, b) => a + b, 0);

    let cntx = document.getElementById("paymentCanvas") as HTMLCanvasElement;
    this.suppliersChart = new Chart(cntx.getContext('2d'), {
      type: "pie",
      data: {
        labels: ["Cash", "MPesa", "Card"],
        datasets: [
          {
            data: [cashData, mpesaData, cardData],
            backgroundColor: this.universalScheme
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }

  //charts sales/purchase status
  chartPurchaseStatus(): void {
    let pendingCosts = [];
    let completedCosts = [];
    let approvedCosts = [];
    let statusData = [];
    this.data.map(item => {
      if (item['status'] == 'pending') {
        pendingCosts.push(item['totalcost']);
      } else if (item['status'] == 'completed') {
        completedCosts.push(item['totalcost']);
      } else if (item['status'] == 'approved') {
        approvedCosts.push(item['totalcost']);
      }
    });
    let pendingTotal = pendingCosts.reduce((a, b) => a + b, 0);
    let completedTotal = completedCosts.reduce((a, b) => a + b, 0);
    let approvedTotal = approvedCosts.reduce((a, b) => a + b, 0);

    statusData.push(pendingTotal, completedTotal, approvedTotal);
    console.log(statusData);
    let statusLabels = ['Pending Approval', 'Paid', 'Approved'];
    
    let cntx = document.getElementById('statusCanvas') as HTMLCanvasElement;
    new Chart(cntx.getContext('2d'), {
      type: 'pie',
      data: {
        labels: statusLabels,
        datasets: [
          {
            data: statusData,
            backgroundColor: this.universalScheme
          }
        ]
      },
      options: {
        responsive: true
      }
    })
  }

  //charts sales/payment mode
  chartPurchaseType(): void {
    let nowCost = [];
    let deliveryCost = [];
    let laterCost = [];
    let chartData = [];
    let modeLabels = ["Pay Now", "Pay on Delivery", "Credit"];
    let modeData = [];
    this.data.map(item => {
      if (item['paymentMode'] == 'Pay now') {
        nowCost.push(item['totalcost']);
      } else if (item['paymentMode'] == 'pay on delivery') {
        deliveryCost.push(item['totalcost']);
      } else {
        laterCost.push(item['totalcost']);
      }
    });
    //console.log('array pay now total: ', nowCost);
    //console.log('array credit total: ', laterCost);
    this.nowTotal = nowCost.reduce((a, b) => a + b, 0);
    //console.log('now total', nowTotal);
    this.laterTotal = laterCost.reduce((a, b) => a + b, 0);
    //console.log('now total', laterTotal);
    this.deliveryTotal = deliveryCost.reduce((a, b) => a + b, 0);
    
    modeData.push(this.nowTotal, this.deliveryTotal, this.laterTotal);
    //console.log(modeData);
    let cntx = document.getElementById('modeCanvas') as HTMLCanvasElement;
    new Chart(cntx.getContext('2d'), {
      type: 'pie',
      data: {
        labels: modeLabels,
        datasets: [
          {
            data: modeData,
            backgroundColor: this.universalScheme
          }
        ]          
      },
      options: {
        responsive: true
      }
    })
  }

  //charts sales/supplier against time
  //chartSupplierSalesTime() {}
  chartSupplierSalesTime() {
    let cntx = document.getElementById('b') as HTMLCanvasElement;
    this.cumulativeChart = new Chart(cntx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
        datasets: [{
          data: [1200, 1198, 1130, 1165, 1120, 1189],
          label: "EABL",
          borderColor: "#FF4500",
          lineTension: 0.1,
          fill: false
        }, 
        {
          data: [1320, 1318, 1300, 1365, 1320, 1389],
          label: "ARAT",
          borderColor: "#0d98ba",
          lineTension: 0.1,
          fill: false
        }, {
          data: [1220, 1218, 1200, 1265, 1220, 1289],
          label: "BAT",
          borderColor: "#00b287",
          lineTension: 0.1,
          fill: false
        }
      ]
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: "Suppliers' Sales Over Time"
        },
        legend: {
          display: true,
          position: "top"
        }
      }
    });
  }

}
