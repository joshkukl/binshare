import mongoose, { Schema, InferSchemaType } from "mongoose";
import { DataTypes } from "@/types/types";
import slugify from 'slugify';
// move this to types...
interface IProjectSchema {
    _id: mongoose.Types.ObjectId,
    type: string;
    title: string;
    description?: string;
    slug: string;
    completed: boolean;
    active: boolean;
}

const projectSchema: Schema<IProjectSchema> = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: DataTypes.project,
        readonly: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        minlength: [3, 'Title must be at least 3 characters'],
        max_length: [50, 'Title cannot be more than 50 characters'],
        match: [/^[a-zA-Z0-9 ]+$/, 'Title must be alphanumeric'],
        unique: true,
    },
    description: {
        type: String,
        required: false,
        minlength: [3, 'Description must be at least 3 characters'],
        max_length: [350, 'Description cannot be more than 350 characters'],
        match: [/^[a-zA-Z0-9 ]+$/, 'Description must be alphanumeric'],
    },
    slug: {
        type: String,
        slug: "title",
        unique: true,
    },
    completed: {
        type: Boolean,
        required: true,
        set: (value: string | boolean) => {
            if (typeof value === 'string' && value === 'on') {
                return true;
            }
            return false;
        },
        default: false,
    },
    active: {
        type: Boolean,
        required: true,
        set: (value: string | boolean) => {
            if (typeof value === 'string' && value === 'on') {
                return true;
            }
            return false;
        },
        
    },

}, { timestamps: true, autoIndex: true });

projectSchema.pre('save',  async function() {
    //console.log('Pre Save triggered: ' + this.active);
    //must use function() and not arrow function to access 'this' context of the document being saved

    return new Promise<void>((resolve, reject) => {

        try {
            if(this.active == null || typeof this.active === 'string') {
                if (this.active === 'on') {
                    this.active = true;
                } else {
                    this.active = false;
                }
            }
            if(this.completed == null || typeof this.completed === 'string') {
                if (this.completed === 'on') {
                    this.completed = true;
                } else {   
                    this.completed = false;
                }
            }
            if (this.slug == null && this.title != null) {
                this.slug = slugify(this.title, { lower: true, remove: /[^A-Za-z0-9\s]/g });
            }
            //console.log('Pre Save triggered: ' + this.active);
            resolve();
        }
        catch (err) {
            reject(err instanceof Error ? err : new Error('Unknown error during pre-save'));
        }
    });
});

    type ProjectModelType = InferSchemaType<typeof projectSchema>;
    const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

    export default Project;
    export type { ProjectModelType };