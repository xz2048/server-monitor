import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {isSuccess, paringDate} from "../../helper/utils";

import {Card, List, Table} from 'antd';
import dayjs from "dayjs";

const columns_gpu = [
    {
        title: '索引',
        dataIndex: 'index',
    },
    {
        title: '显卡名称',
        dataIndex: 'name',

    },
    {
        title: '显存',
        dataIndex: 'memory',
    },
    {
        title: '电源功率',
        dataIndex: 'power',
    },
    {
        title: '显卡利用率',
        dataIndex: 'utilization',

    },
    {
        title: '风扇',
        dataIndex: 'fan',

    },
    {
        title: '温度',
        dataIndex: 'temperature',
    },
];

const columns_proc = [
    {
        title: '显卡索引',
        dataIndex: 'index_prc',
    },
    {
        title: 'PID',
        dataIndex: 'pid',

    },

    {
        title: '占用显存',
        dataIndex: 'memory_proc',

    },
    {
        title: '进程名称',
        dataIndex: 'name_proc',

    },
    {
        title: '工作目录',
        dataIndex: 'cwd',
        render: (text) => {
            return text === '' ? '无法获取' : text
        },
    },
    // {
    //     title: '指令',
    //     dataIndex: 'exe',
    //
    // },
];


const GPUInfo = () => {


    const {ip} = useParams();

    const [gpuinfos, setGpuInfos] = useState([]);
    const [gpuprosinfos, setGpuProcInfos] = useState([]);

    const loadHosts = async () => {
        await axios({
            method: 'GET',
            url: '/server/gpu?ip=' + ip
        }).then(response => {
            const {code, message, data} = response.data;
            // console.log(data)
            if (isSuccess(code)) {
                setGpuInfos(data);
            }
        })

        await axios({
            method: 'GET',
            url: '/server/gpu/proc?ip=' + ip
        }).then(response => {
            const {code, message, data} = response.data;
            console.log(data)
            if (isSuccess(code)) {
                setGpuProcInfos(data);
            }
        })

    }


    useEffect(() => {
        loadHosts()
            .then(() => {

            })
            .catch((reason) => {
                console.log(reason)
            })
    }, [])
    const columns_name = ['key', 'index', 'name', 'memory', 'power', 'utilization', 'fan', 'temperature'];
    const gpuinfo_name = ['indexGpu', 'indexGpu', 'nameGpu', 'memory', 'power', 'utilizationRate', 'fanSpeed', 'temperature']
    const suffix = ['', '', '', '', '', '%', '%', ' ℃',]
    const getData = (gpuinfos) => {
        if (gpuinfos !== undefined) {
            const res = gpuinfos.map((g) => {
                let tabel_g = {};
                for (let i = 0; i < columns_name.length; i++) {
                    if (columns_name[i] === 'memory') {
                        tabel_g[columns_name[i]] = g['memoryUsed'].toString() + ' MB / ' + g['memoryTotal'] + ' MB'
                        // tabel_g[columns_name[i]] = 123
                    } else if (columns_name[i] === 'power') {
                        tabel_g[columns_name[i]] = g['powerUsage'].toString() + ' W / ' + g['enforcedPowerLimit'] + ' W'
                        // tabel_g[columns_name[i]] = g['powerUsage'].toString() + 'W / ' + g['enforcedPowerLimit'] +'W'
                        // tabel_g[columns_name[i]] = 123412
                    } else if (columns_name[i] === 'date') {

                        tabel_g[columns_name[i]] = paringDate(g[gpuinfo_name[i]].toString(), "YYYY-MM-DD HH:mm");
                    } else {
                        tabel_g[columns_name[i]] = g[gpuinfo_name[i]].toString() + suffix[i];
                    }

                }
                return tabel_g;
            })
            return res;
        }
        return null;

    }

    const columns_proc_name = ['key', 'index_prc', 'pid', 'cwd', 'memory_proc', 'name_proc']
    const gpuinfo_proc_name = ['pid', 'indexGpu', 'pid', 'cwd', 'memoryUsed', 'nameProc']
    const suffix_proc = ['', '', '', '', ' MB', '']

    const getProcData = (gpuprosinfos) => {
        if (gpuprosinfos === undefined)
            return []

        const res = gpuprosinfos.map((one_info) => {
                let table_item = {}
                for (let i = 0; i < columns_proc_name.length; i++) {
                    table_item[columns_proc_name[i]] = one_info[gpuinfo_proc_name[i]].toString() + suffix_proc[i]
                }
                return table_item;
            }
        )
        return res;
    }


    return (
        <div>
            <List
                grid={{gutter: 9, column: 3}}
                dataSource={[{name: 'IP', content: ip},
                    {name: '驱动版本', content: gpuinfos.length > 0 ? gpuinfos[0].driverVersion : ""},
                    {
                        name: '最新上报日期',
                        content: gpuinfos.length > 0 ? paringDate(gpuinfos[0].dateGpu, "YYYY-MM-DD HH:mm") : ""
                    }]}
                renderItem={(item) => (
                    <List.Item>
                        <Card title={item.name}>{item.content}</Card>
                    </List.Item>
                )}
            />

            {/*IP: {ip}*/}
            {/*驱动版本：{gpuinfos.length>0 ? gpuinfos[0].driverVersion:""}*/}
            <h1 style={{textAlign: 'left'}}>显卡信息</h1>
            <Table pagination={{hideOnSinglePage: true}} columns={columns_gpu} dataSource={getData(gpuinfos)}/>
            <h1 style={{textAlign: 'left'}}>进程信息</h1>
            <Table pagination={{hideOnSinglePage: true}} columns={columns_proc} dataSource={getProcData(gpuprosinfos)}/>
        </div>
    );
};

export default GPUInfo;