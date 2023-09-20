/*
 * Since arrays are pass-by-reference in JavaScript, this function
 * will mutate the passed array 'grouplist'.
 * 
 * The permissions field will contain all inherited permission directly in the
 * passed array.
 */ 
export function parse_flat_to_tree(grouplist: any): Group {
    const groupMap: Record<number, Group> = {};
    const rootGroup: Group = new Group();

    // Convert flat list to a map of groups
    grouplist.forEach((group: any) => {
    const newGroup: Group = {
        gid: group.gid,
        name: group.name,
        permissions: group.permissions,
        children: [],
        parent: undefined,
    };
    groupMap[group.gid] = newGroup;
    });

    // Build the tree structure
    grouplist.forEach((group: any) => {
    const currentGroup = groupMap[group.gid];

    if (group.gid == 0) {
        // Root group
        rootGroup.gid = currentGroup.gid;
        rootGroup.name = currentGroup.name;
        rootGroup.permissions = currentGroup.permissions;
        rootGroup.children = currentGroup.children;
        rootGroup.parent = currentGroup.parent;
    } else {
        // Child group
        const parentGroup = groupMap[group.parent_gid];
        currentGroup.parent = parentGroup;

        // Since we inherit all permissions from the parent, assign the permissions to the child aswell
        for(let permission of parentGroup.permissions ?? [ ]) {
            let has_permission = false;

            // Check if the child already has the permission directly.
            for(let child_permission of currentGroup.permissions ?? [ ]) {
                if(child_permission.pid == permission.pid) {
                    has_permission = true;
                }
            }

            // The child doesn't have this permission directly, but inherits it, so we
            // add it to the child.
            if(!has_permission) {
                currentGroup.permissions?.push(permission)
            }
        }

        parentGroup.children.push(currentGroup);
    }
    });
    return rootGroup;
}

export class Group {
    gid?: number;
    name?: string;
    permissions?: Permission[];
    children: Group[] = [ ];
    parent?: Group;
}

class Permission {
    pid: number;
    name: string;
    description: string;
  
    constructor(pid: number, name: string, description: string) {
      this.pid = pid;
      this.name = name;
      this.description = description
    }
  }