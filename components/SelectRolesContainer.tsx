import { rolesType } from "@/bot/types";

interface SelectRolesProps {
  roles: Array<rolesType>;
  setSelectedRoles: Function;
  selectedRoles: Array<string>;
}

const SelectRolesContainer: React.FC<SelectRolesProps> = ({
  roles,
  setSelectedRoles,
  selectedRoles,
}) => {
  return (
    <div>
      {roles
        .sort((a: rolesType, b: rolesType) => b.rawPosition - a.rawPosition)
        .map((_: rolesType, idx: number) => {
          const active: boolean = !!selectedRoles.find(
            (channelId: string) => channelId === _.id
          );

          return (
            <div
              key={idx}
              style={{ color: active ? "blue" : "black" }}
              onClick={() => {
                const i: number = selectedRoles.indexOf(_.id);
                if (i < 0)
                  setSelectedRoles((selectedRoles) => [_.id, ...selectedRoles]);
                else
                  setSelectedRoles((selectedRoles) =>
                    selectedRoles.filter(
                      (_: string, index: number) => index !== i
                    )
                  );
              }}
            >
              {_.name}
            </div>
          );
        })}
    </div>
  );
};

export default SelectRolesContainer;
