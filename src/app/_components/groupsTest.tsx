"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

export function GroupsTester() {
  const [groupName, setGroupName] = useState("Test Group");
  const [groupId, setGroupId] = useState<number>(1);
  const [userId, setUserId] = useState<number>(2);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => setLogs((prev) => [msg, ...prev]);

  const createGroup = api.groups.create.useMutation();
  const updateGroup = api.groups.update.useMutation();
  const deleteGroup = api.groups.delete.useMutation();

  const addMember = api.groups.addMember.useMutation();
  const removeMember = api.groups.removeMember.useMutation();
  const joinGroup = api.groups.joinGroup.useMutation();
  const leaveGroup = api.groups.leaveGroup.useMutation();

  const allGroupIds = api.groups.getAllGroupIds.useQuery();
  const groupDetails = api.groups.getGroupFromId.useQuery(
    { groupId },
    { enabled: false },
  );

  const handleCreate = async () => {
    try {
      const group = await createGroup.mutateAsync({ name: groupName });
      log(`✅ Created group: ${group.name} (ID: ${group.id})`);
      setGroupId(group.id);
    } catch (err: any) {
      log(`❌ Failed to create group: ${err.message}`);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateGroup.mutateAsync({ groupId, name: groupName + " Updated" });
      log(`✅ Updated group name to: ${groupName} Updated`);
    } catch (err: any) {
      log(`❌ Failed to update group: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync({ groupId });
      log(`🗑️ Deleted group ID ${groupId}`);
    } catch (err: any) {
      log(`❌ Failed to delete group: ${err.message}`);
    }
  };

  const handleAddMember = async () => {
    try {
      await addMember.mutateAsync({ groupId, userId });
      log(`➕ Added user ${userId} to group ${groupId}`);
    } catch (err: any) {
      log(`❌ Add member failed: ${err.message}`);
    }
  };

  const handleRemoveMember = async () => {
    try {
      await removeMember.mutateAsync({ groupId, userId });
      log(`➖ Removed user ${userId} from group ${groupId}`);
    } catch (err: any) {
      log(`❌ Remove member failed: ${err.message}`);
    }
  };

  const handleJoin = async () => {
    try {
      await joinGroup.mutateAsync({ groupId });
      log(`🙋‍♂️ Joined group ${groupId}`);
    } catch (err: any) {
      log(`❌ Join failed: ${err.message}`);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGroup.mutateAsync({ groupId });
      log(`👋 Left group ${groupId}`);
    } catch (err: any) {
      log(`❌ Leave failed: ${err.message}`);
    }
  };

  const handleFetchGroup = async () => {
    try {
      const group = await groupDetails.refetch();
      log(`📄 Group: ${JSON.stringify(group.data)}`);
    } catch (err: any) {
      log(`❌ Fetch failed: ${err.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">📦 Group API Tester</h1>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="number"
          placeholder="Group ID"
          value={groupId}
          onChange={(e) => setGroupId(Number(e.target.value))}
          className="border px-2 py-1"
        />
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="border px-2 py-1"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleCreate}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Create
        </button>
        <button
          onClick={handleUpdate}
          className="rounded bg-yellow-500 px-3 py-1 text-white"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="rounded bg-red-500 px-3 py-1 text-white"
        >
          Delete
        </button>
        <button
          onClick={handleAddMember}
          className="rounded bg-green-500 px-3 py-1 text-white"
        >
          Add Member
        </button>
        <button
          onClick={handleRemoveMember}
          className="rounded bg-gray-600 px-3 py-1 text-white"
        >
          Remove Member
        </button>
        <button
          onClick={handleJoin}
          className="rounded bg-purple-500 px-3 py-1 text-white"
        >
          Join
        </button>
        <button
          onClick={handleLeave}
          className="rounded bg-pink-500 px-3 py-1 text-white"
        >
          Leave
        </button>
        <button
          onClick={handleFetchGroup}
          className="rounded bg-indigo-500 px-3 py-1 text-white"
        >
          Fetch Group
        </button>
      </div>

      <div className="h-64 overflow-y-auto rounded bg-black p-4">
        <h2 className="mb-2 font-semibold">📝 Logs:</h2>
        <ul className="space-y-1 font-mono text-sm">
          {logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
