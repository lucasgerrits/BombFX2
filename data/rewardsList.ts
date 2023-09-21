import { AggroReward } from "../effects/aggro/Aggro.js";
import { AguaReward } from "../effects/agua/Agua.js";
import { BarkeepReward } from "../effects/barkeep/Barkeep.js";
import { BigPPReward } from "../effects/bigpp/BigPP.js";
import { ButtsbotWordReward, CloneHeroRequestReward, FiveMinPaintReward, NutButtonReward, SubparImpressionReward, TypeRacerBreakReward } from "../effects/misc/MiscRewards.js";
import { CodecReward } from "../effects/codec/Codec.js";
import { CowReward, GoldenCowReward } from "../effects/cow/Cow.js";
import { CrimbobReward } from "../effects/crimbob/Crimbob.js";
import { FanfareReward } from "../effects/fanfare/Fanfare.js";
import { FridayReward } from "../effects/friday/Friday.js";
import { HardwareReward } from "../effects/hardware/Hardware.js";
import { JamBreakReward } from "../effects/jambreak/JamBreak.js";
import { LightsReward } from "../effects/lights/Lights.js";
import { NiceReward } from "../effects/nice/Nice.js";
import { NotifsReward } from "../effects/notifs/Notifs.js";
import { OrbReward } from "../effects/orb/Orb.js";
import { PanicSwitchReward } from "../effects/panic/PanicSwitch.js";
import { PauseReward } from "../effects/pause/Pause.js";
import { RonaldReward } from "../effects/ronald/Ronald.js";
import { SFXReward, SFXBombReward, SFXDoubleSpeedReward, SFXQuarterSpeedReward } from "../effects/sfx/SFX.js";
import { SpacebarReward } from "../effects/spacebar/Spacebar.js";
import { SubsAndDubsReward } from "../effects/subsanddubs/SubsandDubs.js";
import { SunnyReward } from "../effects/sunny/Sunny.js";
import { TheWordReward } from "../effects/secretword/TheWord.js";
import { TimeWarpReward } from "../effects/timewarp/TimeWarp.js";
import { TwizzieReward } from "../effects/misc/Twizzies.js";
import { UwuReward } from "../effects/uwu/Uwu.js";
import { VFXReward } from "../effects/vfx/VFX.js";
import { WeatherReward } from "../effects/weather/Weather.js";
import { YodaReward } from "../effects/yoda/Yoda.js";
import { ZoraReward } from "../effects/zora/Zora.js";
import type { RewardMapping } from "../types/AppTypes";

export const rewardsList: Array<RewardMapping> = [
    { key: AggroReward.id, value: new AggroReward() },
    { key: AguaReward.id, value: new AguaReward() },
    { key: BarkeepReward.id, value: new BarkeepReward() },
    { key: BigPPReward.id, value: new BigPPReward() },
    { key: ButtsbotWordReward.id, value: new ButtsbotWordReward() },
    //{ key: CloneHeroRequestReward.id, value: new CloneHeroRequestReward() },
    { key: CodecReward.id, value: new CodecReward() },
    { key: CowReward.id, value: new CowReward() },
    { key: CrimbobReward.id, value: new CrimbobReward() },
    { key: FanfareReward.id, value: new FanfareReward() },
    //{ key: FiveMinPaintReward.id, value: new FiveMinPaintReward() },
    { key: FridayReward.id, value: new FridayReward() },
    { key: GoldenCowReward.id, value: new GoldenCowReward() },
    //{ key: HardwareReward.id, value: new HardwareReward() },
    { key: JamBreakReward.id, value: new JamBreakReward() },
    { key: LightsReward.id, value: new LightsReward() },
    { key: NiceReward.id, value: new NiceReward() },
    //{ key: NotifsReward.id, value: new NotifsReward() },
    { key: NutButtonReward.id, value: new NutButtonReward() },
    //{ key: OrbReward.id, value: new OrbReward() },
    { key: PanicSwitchReward.id, value: new PanicSwitchReward() },
    { key: PauseReward.id, value: new PauseReward() },
    { key: RonaldReward.id, value: new RonaldReward() },
    { key: SFXReward.id, value: new SFXReward() },
    { key: SFXBombReward.id, value: new SFXBombReward() },
    { key: SFXDoubleSpeedReward.id, value: new SFXDoubleSpeedReward() },
    { key: SFXQuarterSpeedReward.id, value: new SFXQuarterSpeedReward() },
    { key: SpacebarReward.id, value: new SpacebarReward() },
    //{ key: SubparImpressionReward.id, value: new SubparImpressionReward() },
    { key: SubsAndDubsReward.id, value: new SubsAndDubsReward() },
    { key: SunnyReward.id, value: new SunnyReward() },
    { key: TheWordReward.id, value: new TheWordReward() },
    { key: TimeWarpReward.id, value: new TimeWarpReward() },
    //{ key: TwizzieReward.id, value: new TwizzieReward() },
    //{ key: TypeRacerBreakReward.id, value: new TypeRacerBreakReward() },
    //{ key: UwuReward.id, value: new UwuReward() },
    { key: VFXReward.id, value: new VFXReward() },
    { key: WeatherReward.id, value: new WeatherReward() },
    //{ key: YodaReward.id, value: new YodaReward() },
    { key: ZoraReward.id, value: new ZoraReward() }
];