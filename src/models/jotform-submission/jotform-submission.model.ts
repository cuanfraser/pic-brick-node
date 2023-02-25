import { model } from 'mongoose';
import { IJotformSubmission, jotformSubmissionSchema } from './jotform-submission.schema.js';

const JotformSubmissionModel = model<IJotformSubmission>('JotformSubmission', jotformSubmissionSchema);

export { JotformSubmissionModel };
