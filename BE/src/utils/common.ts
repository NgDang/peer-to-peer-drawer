export const dynamicTopic = (topic : string, ...rest: any) => `${topic}${rest.map((key:string) => `_${key}`).join('')}`
