import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import "./brand";
import { FPS, HEIGHT, loadManifest, type Timeline, WIDTH } from "./lib/timeline";
import * as qf from "./question-first/timeline";
import { sceneAlone } from "./components/SceneAlone";
import { QUESTION_FIRST_SCENES, QuestionFirst } from "./question-first/QuestionFirst";
import * as fs from "./fix-it-small/timeline";
import { FIX_IT_SMALL_SCENES, FixItSmall } from "./fix-it-small/FixItSmall";

// Each video's timeline follows its voice lines prepared in public/media (npm run prep), or estimates.
type Video<T extends Timeline> = { id: string; build: (m: Awaited<ReturnType<typeof loadManifest>>) => T; planned: T };

function metadata<T extends Timeline>(video: Video<T>, scene?: keyof T["scenes"] & string): CalculateMetadataFunction<{ timeline: T }> {
  return async ({ abortSignal }) => {
    const timeline = video.build(await loadManifest(video.id, abortSignal));
    return { durationInFrames: scene ? timeline.scenes[scene].frames : timeline.total, props: { timeline } };
  };
}

const QF: Video<qf.Timeline> = { id: qf.VIDEO, build: qf.buildTimeline, planned: qf.PLANNED };
const FS: Video<fs.Timeline> = { id: fs.VIDEO, build: fs.buildTimeline, planned: fs.PLANNED };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="QuestionFirst" component={QuestionFirst} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={QF.planned.total} defaultProps={{ timeline: QF.planned }} calculateMetadata={metadata(QF)} />
    <Folder name="QuestionFirst-Scenes">
      {QUESTION_FIRST_SCENES.map((s, i) => (
        <Composition
          key={s.id}
          id={`QuestionFirst-${i + 1}-${s.name}`}
          component={sceneAlone(s.component)}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={QF.planned.scenes[s.id].frames}
          defaultProps={{ timeline: QF.planned }}
          calculateMetadata={metadata(QF, s.id)}
        />
      ))}
    </Folder>
    <Composition id="FixItSmall" component={FixItSmall} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={FS.planned.total} defaultProps={{ timeline: FS.planned }} calculateMetadata={metadata(FS)} />
    <Folder name="FixItSmall-Scenes">
      {FIX_IT_SMALL_SCENES.map((s, i) => (
        <Composition
          key={s.id}
          id={`FixItSmall-${i + 1}-${s.name}`}
          component={sceneAlone(s.component)}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={FS.planned.scenes[s.id].frames}
          defaultProps={{ timeline: FS.planned }}
          calculateMetadata={metadata(FS, s.id)}
        />
      ))}
    </Folder>
  </>
);
