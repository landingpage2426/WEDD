import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { motion } from 'framer-motion';
function Graphe({ invites }) {
  const [series, setSeries] = useState([0, 0]);
  const [totalInvites, setTotalInvites] = useState(0);

  useEffect(() => {
    const presents = invites.filter(invite => invite.status?.toUpperCase() === 'P').length;
    const absents = invites.filter(invite => invite.status?.toUpperCase() === 'A').length;
    const noResponse = invites.filter(invite => !invite.status).length;
    
    setSeries([presents, absents, noResponse]);
    setTotalInvites(invites.length);
  }, [invites]);

  const options = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      }
    },
    labels: [
      `Présents (${series[0]})`, 
      `Absents (${series[1]})`,
      `En attente (${series[2]})`
    ],
    colors: ['#16a34a', '#dc2626', '#3b82f6'],
    legend: {
      show:false,
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      itemMargin: {
        horizontal: 12,
        vertical: 8
      },
      markers: {
        width: 10,
        height: 10,
        radius: 5
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Invités',
              fontSize: '16px',
              fontWeight: 600,
              color: '#1f2937',
              formatter: () => totalInvites
            },
            value: {
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              formatter: (value) => `${Math.round(value / totalInvites * 100)}%`
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value} invité(s) (${Math.round(value / totalInvites * 100)}%)`
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
         
        }
      }
    }],
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      }
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Statistiques de participation</h3>
        <p className="text-sm text-gray-500">{totalInvites} invités au total</p>
      </div>
      
      <div className="w-full h-[200px]">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width="100%"
          height="100%"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-green-50 rounded-lg">
          <p className="text-green-600 font-medium">{series[0]}</p>
          <p className="text-xs text-gray-600">Présents</p>
        </div>
        <div className="p-2 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">{series[1]}</p>
          <p className="text-xs text-gray-600">Absents</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <p className="text-blue-600 font-medium">{series[2]}</p>
          <p className="text-xs text-gray-600">En attente</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Graphe;