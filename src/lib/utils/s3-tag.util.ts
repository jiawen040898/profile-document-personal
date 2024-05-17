import { Tag } from '@aws-sdk/client-s3';

export const s3TagUtil = {
    buildTagString: (tag: { [key: string]: string }): string => {
        const tagStrings = Object.entries(tag)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        return tagStrings;
    },

    buildTagSet: (tags: { [key: string]: string }): Tag[] => {
        const tagSet: Tag[] = [];

        for (const key of Object.keys(tags)) {
            tagSet.push({ Key: key, Value: tags[key] });
        }

        return tagSet;
    },

    findTagKey: (tagSet: Tag[], key: string): Tag | undefined => {
        return tagSet.find((i) => i.Key === key);
    },

    getTagKeyValue: (tagSet: Tag[], key: string): string => {
        const keyFound = tagSet.find((i) => i.Key === key);

        return keyFound?.Value ?? '';
    },
};
