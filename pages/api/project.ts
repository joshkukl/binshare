import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/library/db';
import Project, { ProjectModelType } from '@/models/project';


type ResponseData = {
    message?: string,
    data?: ProjectModelType[],
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    await dbConnect();
    const { method } = req;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    switch (method) {
        case 'GET':
            try {
                const project = await Project.find({});
                res.statusCode = 200;
                res.end(JSON.stringify({ message: 'Project Found', data: project }));
                break;
            } catch (err) {
                //console.error('Project Error: ' + err);
                res.statusCode = 400;
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                res.end(JSON.stringify({ message: errorMessage }) || JSON.stringify({ message: 'Error: Project Failed' }));
                break;
            }
        case 'POST':
            try {
                const newProjectModel = await new Project(req.body);
                const project = await Project.create(newProjectModel);
                res.statusCode = 201;
                res.end(JSON.stringify({ message: `${project.title} Project Was Created`, data: [project] }));
                break;
            } catch (err) {
                res.statusCode = 400;
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                res.end(JSON.stringify({ message: errorMessage, errors: err }) || JSON.stringify({ message: 'Project Failed to Post' }));
                //res.end(JSON.stringify({ message: 'Task Failed to Post' }));
                break;
            }
        default:
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Error: Project Failed' }));
            break;
    }
}