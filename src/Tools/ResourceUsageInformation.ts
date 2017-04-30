//统计远端资源消耗

export default class ResourceUsageInformation {
    constructor(
        readonly cpuUsage: Number = 0,
        readonly memoryUsage: Number = 0
    ) { }
}