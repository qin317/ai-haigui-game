export interface Story {
  id: string
  title: string
  difficulty: '简单' | '中等' | '困难'
  genre: string
  surface: string
  bottom: string
}

export const stories: Story[] = [
  {
    id: '1',
    title: '迟到的生日',
    difficulty: '简单',
    genre: '日常',
    surface: '小明的生日派对上，朋友们都到了，却没有一个人说“生日快乐”。',
    bottom: '小明的生日是在昨天，朋友们为了给他惊喜，故意等到今天才举办派对，但大家都忘了说“生日快乐”。'
  },
  {
    id: '2',
    title: '空的水杯',
    difficulty: '简单',
    genre: '推理',
    surface: '桌子上有一个空水杯，旁边放着一张纸条。纸条上写着“谢谢”。',
    bottom: '小明的朋友来家里做客，口渴了但没水，于是留下纸条感谢小明的招待。后来小明发现了纸条，把水倒在了自己的杯子里。'
  },
  {
    id: '3',
    title: '未接来电',
    difficulty: '中等',
    genre: '悬疑',
    surface: '小红的手机响了，但她没有接。后来她发现，这个未接来电救了她一命。',
    bottom: '小红的手机在口袋里震动，她正要拿出手机时，突然听到一声巨响，旁边的电线杆倒了下来。如果她当时拿出手机，可能会被电线杆砸中。'
  },
  {
    id: '4',
    title: '破碎的镜子',
    difficulty: '中等',
    genre: '奇幻',
    surface: '小美打碎了镜子，但她没有受伤。第二天，她发现镜子又完好无损了。',
    bottom: '小美打碎的是镜子的照片，而不是真实的镜子。第二天，她重新打印了一张镜子的照片，所以看起来镜子又完好无损了。'
  },
  {
    id: '5',
    title: '上锁的门',
    difficulty: '困难',
    genre: '推理',
    surface: '小李回到家，发现门被锁了。他没有钥匙，但还是进去了。',
    bottom: '小李的门是用密码锁锁的，他忘记了密码，但他通过门上的猫眼看到了房间里的时钟，而时钟的时间正好是他设置的密码。'
  },
  {
    id: '6',
    title: '无声的音乐',
    difficulty: '简单',
    genre: '日常',
    surface: '小王在听音乐，但他听不到声音。',
    bottom: '小王在听的是无声音乐，这种音乐没有任何声音，只有歌词和旋律。'
  },
  {
    id: '7',
    title: '消失的信件',
    difficulty: '中等',
    genre: '悬疑',
    surface: '小张收到了一封信，但他打开后发现里面是空的。',
    bottom: '这封信是小张的朋友寄来的，里面原本有一张纸条，但纸条在邮寄过程中掉了出来。小张的朋友后来打电话告诉了他纸条的内容。'
  },
  {
    id: '8',
    title: '未完成的画作',
    difficulty: '困难',
    genre: '艺术',
    surface: '画家画了一幅画，但他没有完成。这幅画却成了他最著名的作品。',
    bottom: '画家在画这幅画时突然去世，他的家人把这幅未完成的画作公开展出。观众们认为这幅画的未完成状态正是画家想要表达的主题。'
  },
  {
    id: '9',
    title: '空的座位',
    difficulty: '简单',
    genre: '日常',
    surface: '教室里有一个空座位，但老师没有问为什么。',
    bottom: '这个空座位是留给请假的同学的，老师已经知道同学请假的原因。'
  },
  {
    id: '10',
    title: '未寄出的信',
    difficulty: '中等',
    genre: '情感',
    surface: '小明写了一封信，但他没有寄出去。',
    bottom: '小明写的是一封道歉信，但他后来发现自己并没有做错什么，所以没有寄出去。'
  }
]

export const STORIES = stories

export function getStoryById(id: string): Story | undefined {
  return stories.find((story) => story.id === id)
}