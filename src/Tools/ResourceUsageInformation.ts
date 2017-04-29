//统计远端资源消耗

export default class ResourceUsageInformation {
    constructor(
        readonly cpuUsage: Number,
        readonly memoryUsage: Number
    ) { }
}