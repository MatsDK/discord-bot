import { rolesType } from "../../bot/types";
import styles from "../css/commandPage.module.css";

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
  const selectAll = () => {
    if (roles.length === selectedRoles.length) setSelectedRoles([]);
    else setSelectedRoles(roles.map((_: rolesType) => _.id));
  };

  return (
    <div>
      <div className={styles.selectionContainerHeader}>
        <label>Roles</label>
        <button
          type="button"
          className={styles.selectAllButton}
          onClick={selectAll}
        >
          Select All
        </button>
      </div>
      <div className={styles.selectionItemsContainer}>
        {roles
          .sort((a: rolesType, b: rolesType) => b.rawPosition - a.rawPosition)
          .map((_: rolesType, idx: number) => {
            const active: boolean = !!selectedRoles.find(
              (channelId: string) => channelId === _.id
            );

            return (
              <div
                className={`${styles.selectionItem} ${
                  active && styles.activeSelectionItem
                }`}
                key={idx}
                onClick={() => {
                  const i: number = selectedRoles.indexOf(_.id);
                  if (i < 0)
                    setSelectedRoles((selectedRoles) => [
                      _.id,
                      ...selectedRoles,
                    ]);
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
    </div>
  );
};

export default SelectRolesContainer;
